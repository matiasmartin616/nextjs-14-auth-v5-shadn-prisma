'use server';
import nodemailer from 'nodemailer';

const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST;
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME;
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD;
const SITE_MAIL_RECIEVER = process.env.SITE_MAIL_RECIEVER;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: SMTP_SERVER_HOST,
  port: 587,
  secure: true,
  auth: {
    user: SMTP_SERVER_USERNAME,
    pass: SMTP_SERVER_PASSWORD,
  },
});

export async function sendMail({
  email,
  sendTo,
  subject,
  text,
  html,
}: {
  email: string;
  sendTo?: string;
  subject: string;
  text: string;
  html?: string;
}) {
  try {
    const isVerified = await transporter.verify();
  } catch (error) {
    console.error('Something Went Wrong', SMTP_SERVER_USERNAME, SMTP_SERVER_PASSWORD, error);
    return {error: "Error al enviar email a " + subject + ".", ok: false};
  }
  const info = await transporter.sendMail({
    from: email,
    to: sendTo || SITE_MAIL_RECIEVER,
    subject: subject,
    text: text,
    html: html ? html : '',
  });
  
  /* console.log('Message Sent', info.messageId);
  console.log('Mail sent to', SITE_MAIL_RECIEVER); */
  return {success: 'Mail sent to' + SITE_MAIL_RECIEVER , ok: true};
}

export const sendVerificationEmail = async (email : string, token: string) => {
  const confirmationLink = `${process.env.NEXTAUTH_URL}/auth/verification?token=${token}`
  
  const params = {
    email: SMTP_SERVER_USERNAME ?? "",
    sendTo: email,
    subject: "Verifica tu email en Hekate",
    text: "",
    html: `<p>Clic <a href = ${confirmationLink}>aquí</a> para verificar tu cuenta</p>`,
  }
  
  await sendMail(params);
}

export const sendResetPassEmail = async (email : string, token: string) => {
  const confirmationLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`

  const params = {
    email: SMTP_SERVER_USERNAME ?? "",
    sendTo: email,
    subject: "Restaura tu contraseña",
    text: "",
    html: `<p>Clic <a href = ${confirmationLink}>aquí</a> para restaurar tu contraseña</p>`,
  }
  
  await sendMail(params);
}