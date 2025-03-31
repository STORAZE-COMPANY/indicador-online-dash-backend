import { createTransport } from "nodemailer";
import { SendEmailProps } from "./interfaces";

export const sendEmail = async ({ subject, text, to }: SendEmailProps) => {
  try {
    const transporter = createTransport({
      host: "smtp.exemplo.com", // Exemplo: "smtp.gmail.com"
      port: 587, // Porta SMTP (normalmente 587 ou 465 para SSL)
      secure: false, // true para 465, false para 587
      auth: {
        user: "seuemail@exemplo.com",
        pass: "suasenha",
      },
    });

    const mailOptions = {
      from: '"Seu Nome" <seuemail@exemplo.com>',
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Erro ao enviar e-mail:", errorMessage);
  }
};
