import { RequestHandler, Router } from "express";
import { DebtProducts, PaymentReminderRequest } from "../types/ReminderTypes";
import { getSock } from "../bot";
import dayjs from "dayjs";

import { sendDueReminderEmail } from "../utils/Emails/SendDueReminder/SendDueReminder";

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
        productos: DebtProducts[];
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
    channel,
    totalAmount,
    dias,
    productos,
    fecha_vencimiento,
    client_name,
    client_phone,
    client_email,
    business_name,
    business_phone,
    business_address
  } = req.body;
    try {
        const sockBot = getSock()


        if (!sockBot) {
            res.status(503).json({ error: "Bot de WhatsApp no disponible aún." })
            return
        }

        let message = `📢 Hola ${client_name}, ¡esperamos que estés muy bien! Este es un recordatorio amigable: tenés una deuda pendiente de ${totalAmount}, la cual ${dias} en *${business_name}* 🏢. 📞 Por favor, comunicate con nosotros al ${business_phone} para resolverlo cuanto antes. ${business_address ? `📍 O si lo preferís, podés acercarte a *${business_address}*.` : ""}`.trim();

        const productsMessage = `📦 *Productos asociados:*\n` + productos
            .flat()
            .map(p => `• x${p.product_quantity} - ${p.product_name}`)
            .join("\n")
            .trim();


        console.log(fecha_vencimiento)
        message += `\n${productsMessage}\n`;
        message += `\n📆 *Vencimiento:* ${fecha_vencimiento}`.trim()
        message += `\n🙏 ¡Gracias por tu atención y disculpá las molestias!\n— 🔒 *Fynkapp* | No responder este mensaje automatizado.`

        contextError = {
            client_name: client_name,
            total_amount: totalAmount,
            dias,
            business_name: business_name,
            business_phone: business_phone,
            business_address: business_address,
            productos: productos.flat(),
            fecha_vencimiento: dayjs(fecha_vencimiento).format("DD/MM/YYYY"),
        }

        if (channel === "whatsapp" || channel === "both") {
            await sockBot!.sendMessage(`549${client_phone}@c.us`, {
                text: message
            });
            res.status(200).json({
                msg: "Recordatorio enviado",
                notif_channel: "whatsapp"
            });
            return
        }
        if (channel === "email") {
            const result = await sendByEmail({
                to: client_email,
                subject: `📩 Recordatorio de deuda en ${business_name}`,
                context: contextError
            });

            if (result) {
                res.status(200).json({ msg: "Recordatorio enviado", notif_channel: "email" });
            } else {
                res.status(500).json({ msg: "Error al enviar el recordatorio" });
                return;
            }
        }

    } catch (error) {
        console.log(error)
        if (channel === "both") {
            const result = await sendByEmail({
                to: client_email,
                subject: `📩 Recordatorio de deuda en ${business_name}`,
                context: contextError
            });

            if (result) {
                res.status(200).json({ msg: "Recordatorio enviado", notif_channel: "email" });
            } else {
                res.status(500).json({ msg: "Error al enviar el recordatorio" });
                return;
            }
        } else {
            res.status(500).json({ msg: "Error al enviar el recordatorio" });
            return
        }

    }
};

WAReminder.post("/due-reminders", SendDueReminder);

export default WAReminder;
