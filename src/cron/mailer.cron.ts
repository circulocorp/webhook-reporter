import nodemailer from 'nodemailer';
import cron from 'node-cron';
import {
  get_yesterday_report,
  get_today_report,
  get_today_stats_report,
  get_yesterday_stats_report
} from '../utils/main.utils';
import { NUMBER, Op, literal } from 'sequelize';
import WHookStat from '../models/whook.stats.model';
import Stats from '../models/count.model';

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
      from: "56217fc0e2-78ed7a@inbox.mailtrap.io",
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
    from: "56217fc0e2-78ed7a@inbox.mailtrap.io",
    to: receivers.join(", "),
    subject: "Envío de reporte en status NO ENTREGADO",
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


export const sendEmailStatsToday = async() => {

  const file_to_send = await get_today_stats_report();

  const today = new Date();

  const counts = await WHookStat.findAll({
    attributes: [
      'event',
      [literal('COUNT(*)'), 'count'],
    ],
    where: {
      event: {
        [Op.in]: ['delivery', 'reject'],
      },
      createdAt: {
        [Op.gte]: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0),
        [Op.lt]: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0),
      },
    },
    group: ['event'],
  });

    const deliveryCount = counts.find((count) => count.event === 'delivery')?.get('count') || 0;
    const rejectCount = counts.find((count) => count.event === 'reject')?.get('count') || 0;

  const receivers: string[] = [
    "eduardo.velazquez@circulocorp.com",
    "victor.hernandez@circulocorp.com"
  ]

  const mailOptions = {
    from: "56217fc0e2-78ed7a@inbox.mailtrap.io",
    to: receivers.join(", "),
    subject: "Envío de reporte de estadísticas de envio de correos",
    category: "Reporte de webhooks",
    text: `Reporte de webhooks mailtrap, este correo es generado de forma automática. \n\n
    Estadísticas del día ${today.toLocaleDateString()} \n\n
    En status DELIVERY: ${deliveryCount} \n\n
    En status REJECTED: ${rejectCount} \n\n
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error al enviar el correo electrónico:", error);
    } else {
      console.log("Correo electrónico enviado:", info.response);
    }
  });

};

export const sendEmailStatsYesterday = async () => {

  const today = new Date();
  today.setDate(today.getDate() - 1);

  const counts = await WHookStat.findAll({
    attributes: [
      'event',
      [literal('COUNT(*)'), 'count'],
    ],
    where: {
      event: {
        [Op.in]: ['delivery', 'reject'],
      },
      createdAt: {
        [Op.gte]: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0),
        [Op.lt]: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0),
      },
    },
    group: ['event'],
  });

    const deliveryCount = counts.find((count) => count.event === 'delivery')?.get('count') || 0;
    const rejectCount = counts.find((count) => count.event === 'reject')?.get('count') || 0;

    await Stats.create({
      event: "delivery",
      count: Number(deliveryCount),
      event_two: "reject",
      count_two: Number(rejectCount),
      createdAt: today
    })

    console.log("Datos de estadísticas de correos almacenados correctamente.")

    const file_to_send = get_yesterday_stats_report();

  const receivers: string[] = [
    "eduardo.velazquez@circulocorp.com",
    "victor.hernandez@circulocorp.com"
  ]

  const mailOptions = {
    from: "56217fc0e2-78ed7a@inbox.mailtrap.io",
    to: receivers.join(", "),
    subject: "Envío de reporte de estadísticas de envio de correos",
    category: "Reporte de webhooks",
    text: `Reporte de webhooks mailtrap, este correo es generado de forma automática. \n\n
    Estadísticas del día ${today.toLocaleDateString()} \n\n
    En status DELIVERY: ${deliveryCount} \n\n
    En status REJECTED: ${rejectCount} \n\n
    `,
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
const send_report_hooks = cron.schedule('0 6 * * *', () => {
  console.log('Sending emails...');
  sendEmail();
  sendEmailStatsYesterday();
  console.log('Emails sent.');
}, {
  scheduled: true,
  timezone: "America/Mexico_City"
});

const send_report_hooks_today = cron.schedule('5 18 * * *', () => {
  console.log('Sending emails...');
  sendEmailToday();
  sendEmailStatsToday();
  console.log('Emails sent.');
}, {
  scheduled: true,
  timezone: "America/Mexico_City"
});

export {
  send_report_hooks_today
}

export default send_report_hooks;