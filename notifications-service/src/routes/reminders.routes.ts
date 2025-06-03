import { RequestHandler, Router } from "express";
import { PaymentReminderRequest } from "../types/ReminderTypes";
import { getSock } from "../bot";
import dayjs from "dayjs";
import { tryCatch } from "bullmq";
import { sendDueReminderEmail } from "../utils/Emails/SendDueReminder/SendDueReminder";
import { channel } from "diagnostics_channel";

const WAReminder = Router();
interface EmailProps {
    to: string;
    subject: string;
    context: {
        client_name: string;
        total_amount: string;
        dias: string;
        business_name: string;
        business_phone: string;
        business_address?: string;
        productos: { product_name: string; product_quantity: string }[];
        fecha_vencimiento: string;
    };
}
const sendByEmail = async ({
    to,
    subject,
    context
}: EmailProps): Promise<boolean> => {
    try {
        const result = await sendDueReminderEmail({
            to,
            subject,
            context,
        });

        if (result) return true
        return false
    } catch (error) {
        console.error("❌ Error al enviar correo:", error);
        return false
    }
}

let contextError: EmailProps["context"] = {
    client_name: "",
    total_amount: "",
    dias: "",
    business_name: "",
    business_phone: "",
    business_address: "",
    productos: [],
    fecha_vencimiento: ""
};
const SendDueReminder: RequestHandler<
    {}, {}, PaymentReminderRequest, {}
> = async (req, res): Promise<void> => {
    const {
        clientData,
        clientDebts,
        clientDelivers,
        businessData
    } = req.body;
    try {
        const sockBot = getSock()
        const channel = businessData.notif_option

        if (!sockBot) {
            res.status(503).json({ error: "Bot de WhatsApp no disponible aún." })
            return
        }

        const totalDebts = clientDebts.reduce((acc, debt) => {
            const productos = debt.productos || [];
            return acc + productos.reduce((sum, p) => {
                const precio = Number(p.product_price || "0");
                const cantidad = Number(p.product_quantity || "0");
                return sum + (precio * cantidad);
            }, 0);
        }, 0);

        const totalDelivers = clientDelivers.reduce((acc, curr) => {
            console.log(curr)
            const monto = Number(curr.monto || "0");
            return acc + monto;
        }, 0);

        const totalAmount = (totalDebts - totalDelivers).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
        const vencidas = clientDebts.filter(debt => debt.estado === "Vencida" || debt.estado === "Por vencer");
        const mas_vieja = vencidas.length > 0 ? vencidas.sort((a, b) => dayjs(a.vencimiento).diff(dayjs(b.vencimiento)))[0] : null;
        const daysDifference = mas_vieja ? dayjs().diff(dayjs(mas_vieja.vencimiento), 'day') : 0;

        const dias = daysDifference === 0
            ? "hoy"
            : `hace ${daysDifference} día${daysDifference > 1 ? "s" : ""}`

        let message = `📢 Hola ${clientData.client_name}, ¡esperamos que estés muy bien! 😊 Este es un recordatorio amigable: tenés una deuda pendiente de ${totalAmount} 💸, la cual se encuentra vencida ${dias} en *${businessData.business_name}* 🏢. 📞 Por favor, comunicate con nosotros al ${businessData.business_phone} para resolverlo cuanto antes. ${businessData.business_address ? `📍 O si lo preferís, podés acercarte a *${businessData.business_address}*.` : ""}`.trim();

        const productsMessage = `📦 *Productos asociados:*\n` +
            clientDebts
                .flatMap(debt => debt.productos || [])
                .map(p => `• x${p.product_quantity} - ${p.product_name}`)
                .join("\n").trim();

        message += `\n${productsMessage}\n`;
        message += `\n📆 *Vencimiento:* ${dayjs(mas_vieja?.vencimiento).format("DD/MM/YYYY")}`.trim()
        message += `\n🙏 ¡Gracias por tu atención y disculpá las molestias!\n— 🔒 *Fynkapp* | No responder este mensaje automatizado.`

        contextError = {
            client_name: clientData.client_name,
            total_amount: totalAmount,
            dias,
            business_name: businessData.business_name,
            business_phone: businessData.business_phone,
            business_address: businessData.business_address,
            productos: clientDebts.flatMap(debt => debt.productos || []),
            fecha_vencimiento: dayjs(mas_vieja?.vencimiento).format("DD/MM/YYYY"),
        }

        if (channel === "whatsapp") {
            await sockBot!.sendMessage(`549${clientData.aditional_client_data.client_phone}@c.us`, {
                text: message
            });

            res.status(200).json({
                msg: "Recordatorio enviado",
            });
            return
        }
        if (channel === "email") {
            const result = await sendByEmail({
                to: clientData.aditional_client_data.client_email,
                subject: `📩 Recordatorio de deuda en ${businessData.business_name}`,
                context: contextError
            });

            if (result) {
                res.status(200).json({ msg: "Recordatorio enviado" });
            } else {
                res.status(500).json({ msg: "Error al enviar el recordatorio" });
                return;
            }
        }

    } catch (error) {
        console.log(error)
        if (req.body.businessData.notif_option === "both") {
            const result = await sendByEmail({
                to: clientData.aditional_client_data.client_email,
                subject: `📩 Recordatorio de deuda en ${businessData.business_name}`,
                context: contextError
            });

            if (result) {
                res.status(200).json({ msg: "Recordatorio enviado" });
            } else {
                res.status(500).json({ msg: "Error al enviar el recordatorio" });
                return;
            }
        }else{
            res.status(500).json({ msg: "Error al enviar el recordatorio" });
            return
        }

    }
};

WAReminder.post("/due-reminders", SendDueReminder);

export default WAReminder;
