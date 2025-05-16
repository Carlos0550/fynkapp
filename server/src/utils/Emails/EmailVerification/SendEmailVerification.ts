import "dotenv/config"
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import { getDomain } from "../../DomainHandler";


export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.FYNKAPP_EMAIL,
    pass: process.env.FYNKAPP_EMAIL_SECRET,
  },
}); 

export const sendEmail = async ({
  to,
  subject,
  user_name,
  user_id,
  link_id
}: {
  to: string;
  subject: string;
  user_name: string,
  user_id: string,
  link_id: string
}) => {
  const htmlPath = path.join(__dirname, "./EmailVerification.html")

  let htmlTemplate = fs.readFileSync(htmlPath, "utf-8")

  const url = new URL(`${getDomain()}/auth/user-verification`);
  url.searchParams.append("manager_id", user_id);
  url.searchParams.append("link_id", link_id);

  htmlTemplate = htmlTemplate
    .replace("{{username}}", user_name)
    .replace("{{validation_link}}", url.toString());

  const info = await transporter.sendMail({
    from: `"Equipo de Fynkapp" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html: htmlTemplate,
  });

  return info;
};
