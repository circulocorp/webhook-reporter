import { Request, Response } from "express";
import WHook from "../models/whook.model";
import { IWHookData } from "../interfaces/controllers.interfaces";
import { UniqueConstraintError } from "sequelize"
import { Op } from "sequelize";
import { generate_report_hooks } from "../utils/main.utils";
import { sendEmail, sendEmailToday } from "../cron/mailer.cron";

const SERVICE: string = "WEB HOOKS";

const download_report = async (req: Request, res: Response) => {

    generate_report_hooks();

    res.status(200).json({
        status: 200,
        service: SERVICE,
        message: "Report downloaded successfully."
    })

};

const e_not_delivered = async (req: Request, res: Response) => {

    const events: IWHookData[] = req.body.events;

    try
    {

        for(const event of events){
            await WHook.create(event, {validate: true})
            console.log(`Evento registrado, dirección de email: ${event.email}`);
        }

        return res.status(201).json({
            status: 201,
            service: SERVICE,
            message: "Webhooks events created successfully."
        })

    }
    catch (error)
    {
        if (error instanceof UniqueConstraintError) {

            console.log(`Registro duplicado, la dirección de email: ${error.fields.email} ya existe en la base de datos.`);

            return res.status(200).json({
                status: 200,
                service: SERVICE,
                message: "Registro duplicado, el correo electrónico ya existe en la base de datos."
            })

          } else {
            console.error('Error al guardar datos del webhook:', error);
            res.status(500).json({ error: 'Ocurrió un error al guardar los datos del webhook' });
          }
    }

};

const get_whooks_of_this_day = async (req: Request, res: Response) => {
    
        const currentDate = new Date();
        
        if(req.query.yesterday){
            currentDate.setDate(currentDate.getDate() - 1);
        }

        try
        {
            const whooks = await WHook.findAll({
                where: {
                  createdAt: {
                    [Op.gte]: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0),
                    [Op.lt]: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1, 0, 0, 0),
                  },
                },
              });
    
            return res.status(200).json({
                status: 200,
                service: SERVICE,
                message: "Webhooks events of this day.",
                count: whooks.length,
                data: whooks
            })
        }
        catch (error)
        {
            console.error("Error al obtener los datos del webhook:", error);
            return res.status(500).json({
                status: 500,
                service: SERVICE,
                message: "Ocurrió un error al obtener los datos del webhook."
            })
        }
    
};


const get_whooks_of_this_day_by_email = async (req: Request, res: Response) => {

    try
    {
        const email = await sendEmailToday();

        return res.status(200).json({
            status: 200,
            service: SERVICE,
            message: "Sending email of webhooks events of this day successfully.",
            data: email
        })

    }
    catch(error)
    {

        console.error("Error al obtener los datos del webhook:", error);
        return res.status(500).json({
            status: 500,
            service: SERVICE,
            message: "Ocurrió un error al obtener los datos del webhook."
        })

    }

};

export {
    e_not_delivered,
    get_whooks_of_this_day,
    download_report,
    get_whooks_of_this_day_by_email
}