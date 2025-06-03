import "dotenv/config";
import nodemailer from "nodemailer";
import path from "path";
import hbs, { NodemailerExpressHandlebarsOptions } from "nodemailer-express-handlebars";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.FYNKAPP_EMAIL,
    pass: process.env.FYNKAPP_EMAIL_SECRET,
  },
});


const handlebarOptions: NodemailerExpressHandlebarsOptions = {
  viewEngine: {
    extname: ".hbs",
    partialsDir: path.resolve(__dirname),
    layoutsDir: undefined,
    defaultLayout: undefined,
  },
  viewPath: path.resolve(__dirname),
  extName: ".hbs",
};



transporter.use("compile", hbs(handlebarOptions));

export const sendDueReminderEmail = async ({
  to,
  subject,
  context,
}: {
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
}): Promise<boolean> => {
  try {
    const mailOptions = {
      from: `"Fynkapp Notificaciones" <${process.env.MAIL_USER}>`,
      to,
      subject,
      template: "dueReminder",
      context,
    };

    const result = await transporter.sendMail(mailOptions);

    if (result.accepted.length > 0) return true
    return false
  } catch (error) {
    console.error("❌ Error al enviar correo:", error);
    return false
  }
};