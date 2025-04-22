import "dotenv/config";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

const {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_SES_EMAIL,   
  SES_EMAIL_TO      
} = process.env;

if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_SES_EMAIL || !SES_EMAIL_TO) {
  throw new Error("Faltan variables de entorno necesarias para SES");
}

const sesClient = new SESv2Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

type EmailBodyTypes = {
  text: string;
  html?: string;
};

interface EmailInterface {
  to: string;
  subject: string;
  body: EmailBodyTypes;
}

export async function sendEmail({ to, subject, body }: EmailInterface) {
  const params = {
    FromEmailAddress: AWS_SES_EMAIL,
    Destination: {
      ToAddresses: [to],
    },
    Content: {
      Simple: {
        Subject: {
          Data: subject,
        },
        Body: {
          Text: {
            Data: body.text,
          },
          ...(body.html && {
            Html: { Data: body.html },
          }),
        },
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    const response = await sesClient.send(command);
    console.log("✅ Email enviado:", response.MessageId || response);
    return response;
  } catch (error) {
    console.error("❌ Error al enviar el email:", error);
    throw error;
  }
}

export default sendEmail