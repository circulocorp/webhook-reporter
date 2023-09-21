import { sequelize } from "./main.db";

export const try_connection = async (): Promise<boolean> =>
{
    try {
        await sequelize.authenticate();
        console.log('La conexión a la base de datos ha sido éxitosa.');
        await sequelize.close();
        return true;
      } catch (error) {
        console.error('No se puede conectar a la base de datos.:', error);
        return false;
      }
}

