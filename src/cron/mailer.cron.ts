import nodemailer from 'nodemailer';
import cron from 'node-cron';
import { 
  get_yesterday_report,
  get_today_report
} from '../utils/main.utils';

const { MAILTRAP_USER, MAILTRAP_PASS } = process.env;

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

export const sendEmail = () => {

    const file_to_send = get_yesterday_report();

    const receivers: string[] = [
      "eduardo.velazquez@circulocorp.com",
      "victor.hernandez@circulocorp.com"
    ]
  
    const mailOptions = {
      from: "6e021510b3-8bf4fa@inbox.mailtrap.io",
      to: receivers.join(", "),
      subject: "Envío de reporte de webhooks",
      category: "Reporte de webhooks",
      text: "Reporte de webhooks mailtrap, este correo es generado de forma automática.",
      attachments: [file_to_send]
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error al enviar el correo electrónico:", error);
      } else {
        console.log("Correo electrónico enviado:", info.response);
      }
    });
  };

export const sendEmailToday = () => {

  const file_to_send = get_today_report();

  const receivers: string[] = [
    "eduardo.velazquez@circulocorp.com",
    "victor.hernandez@circulocorp.com"
  ]

  const mailOptions = {
    from: "6e021510b3-8bf4fa@inbox.mailtrap.io",
    to: receivers.join(", "),
    subject: "Envío de reporte de webhooks",
    category: "Reporte de webhooks",
    text: "Reporte de webhooks mailtrap, este correo es generado de forma automática.",
    attachments: [file_to_send]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error al enviar el correo electrónico:", error);
    } else {
      console.log("Correo electrónico enviado:", info.response);
    }
  });

};

// Run task every five seconds 
const send_report_hooks = cron.schedule('30 9 * * *', () => {
  console.log('Sending email...');
  sendEmail();
  console.log('Email sent.');
}, {
  scheduled: true,
  timezone: "America/Mexico_City"
});

export default send_report_hooks;