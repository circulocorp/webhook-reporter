import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import WHook from '../models/whook.model';
import { Op } from 'sequelize';
import XLSX from 'xlsx';
import path from 'path';

const today = new Date();
const yesterday = new Date(today);

yesterday.setDate(today.getDate() - 1);

const yesterday_format = yesterday.toISOString().split('T')[0];

const today_format = today.toISOString().split('T')[0];

const rutaAbsoluta = path.resolve(__dirname, `../../reports/whooks-${yesterday_format}.xlsx`);

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  receivedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, receivedPassword);
};

export const generate_token = (user: User): string => {
  if (!process.env.JWT_SECRET_KEY || !process.env.JWT_EXPIRES_IN) {
    throw new Error("Las variables de entorno JWT_SECRET_KEY y JWT_EXPIRES_IN deben estar definidas.");
  }

  const access_token = jwt.sign(
    {
      uuid: user.uuid,
      username: user.username,
      email: user.email,
      name: user.name,
      lastname: user.lastname,
      enterprise: user.enterprise,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return access_token;
};

export const generate_report_hooks_today = async (): Promise<boolean> => {

  const today = new Date();

  const data: WHook[] = await WHook.findAll({
    where: {
      createdAt: {
        [Op.gte]: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0),
        [Op.lt]: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0),
      },
    },
  });

  const dataValuesArray = data.map((item) => item.dataValues);

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(dataValuesArray);
  XLSX.utils.book_append_sheet(wb, ws, "Reporte de Webhooks");

  const column_width: XLSX.ColInfo[] = [
    { wch: 40 },
    { wch: 15 },
    { wch: 15 },
    { wch: 40 },
    { wch: 40 },
    { wch: 15 },
    { wch: 40 },
    { wch: 20 },
    { wch: 10 },
    { wch: 10 },
  ];

  ws['!cols'] = column_width;

  try
  {
    XLSX.writeFile(wb, rutaAbsoluta);
    return true;
  }

  catch (error)
  {
    console.error("Error al generar el reporte de webhooks:", error);
    return false;
  }

};

export const generate_report_hooks = async (): Promise<boolean> => {

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const data: WHook[] = await WHook.findAll({
    where: {
      createdAt: {
        [Op.gte]: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0),
        [Op.lt]: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate() + 1, 0, 0, 0),
      },
    },
  });

  
  const dataValuesArray = data.map((item) => item.dataValues);

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(dataValuesArray);
  XLSX.utils.book_append_sheet(wb, ws, "Reporte de Webhooks");

  const column_width: XLSX.ColInfo[] = [
    { wch: 40 },
    { wch: 15 },
    { wch: 15 },
    { wch: 40 },
    { wch: 40 },
    { wch: 15 },
    { wch: 40 },
    { wch: 20 },
    { wch: 10 },
    { wch: 10 },
  ];

  ws['!cols'] = column_width;

  try
  {
    XLSX.writeFile(wb, rutaAbsoluta);
    return true;
  }

  catch (error)
  {
    console.error("Error al generar el reporte de webhooks:", error);
    return false;
  }

};

export const get_today_report = () => {

  generate_report_hooks_today();

  const file_to_attach = {
    filename: `whooks-${today_format}.xlsx`,
    path: rutaAbsoluta
  };

  return file_to_attach;

};

export const get_yesterday_report = () => {

  generate_report_hooks();

  const file_to_attach = {
    filename: `whooks-${yesterday_format}.xlsx`,
    path: rutaAbsoluta
  };

  return file_to_attach;

};