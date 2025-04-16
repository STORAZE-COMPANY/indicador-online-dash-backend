import { createTransport } from "nodemailer";
import { SendEmailProps } from "./interfaces";

const emailSmtp = "notification@cliqfy.com.br";
const passwordSmtp = "X(285159706557ag";
const smtpHost = "smtp.office365.com";

export const sendEmail = async ({
  subject,
  text,
  to,
  html,
}: SendEmailProps) => {
  try {
    const transporter = createTransport({
      host: smtpHost,
      port: 587,
      secure: false,
      auth: {
        user: emailSmtp,
        pass: passwordSmtp,
      },
    });

    await transporter.sendMail({
      from: `<${emailSmtp}>`,
      to,
      subject,
      text,
      html,
    });
  } catch (error: unknown) {
    console.error("Erro ao enviar e-mail:", error);
    throw new Error("Erro ao enviar e-mail");
  }
};
