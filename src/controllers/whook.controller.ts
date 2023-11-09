import { Request, Response } from "express";
import WHook from "../models/whook.model";
import { IWHookData } from "../interfaces/controllers.interfaces";
import { UniqueConstraintError } from "sequelize"
import { Op, literal } from "sequelize";
import { generate_report_hooks } from "../utils/main.utils";
import { sendEmail, sendEmailToday, sendEmailStatsYesterday } from "../cron/mailer.cron";
import WHookStat from "../models/whook.stats.model";

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

        const date: Date = new Date();

        for(const event of events){
            await WHook.create(event, {validate: true})
            console.log(`Evento registrado, dirección de email: ${event.email} - ${date}`);
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

            const date: Date = new Date();

            console.log(`Registro duplicado, la dirección de email: ${error.fields.email} ya existe en la base de datos. - ${date}`);

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


const get_stats_of_this_day_by_email = async (req: Request, res: Response) => {

    try
    {
        const email = await sendEmailStatsYesterday();

        return res.status(200).json({
            status: 200,
            service: SERVICE,
            message: "Sending email of webhooks stats of this day successfully.",
            data: 'email'
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

const receive_mails_stats = async (req: Request, res: Response) => {

    const {events} = req.body;

    if(events.length === 0)
    {
        return res.status(400).json({
            status: 400,
            service: SERVICE,
            message: "No data received."
        })
    }

    try
    {
        await WHookStat.bulkCreate(events, {validate: true});

        const date: Date = new Date();

        console.log("Datos de estadísticas de correos recibidos guardados correctamente. - " + date);

        return res.status(201).json({
            status: 201,
            service: SERVICE,
            message: "Datos de estadísticas de correos recibidos y guardados correctamente"
        })
    }
    catch(error)
    {
        if (error instanceof UniqueConstraintError) {

            const date: Date = new Date();

            console.log(`Registro duplicado, la dirección de email: ${error.fields.email} ya existe en la base de datos. - ${date}`);

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

const get_stats_of_this_day = async (req: Request, res: Response) => {

    const today = new Date();
    
    try
    {
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

        return res.status(200).json({
            status: 200,
            service: SERVICE,
            message: "Webhooks events of this day.",
            count: {
                delivery: deliveryCount,
                reject: rejectCount
            },
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

const get_stats_of_this_day_email = async (req: Request, res: Response) => {

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
    get_whooks_of_this_day_by_email,
    receive_mails_stats,
    get_stats_of_this_day,
    get_stats_of_this_day_by_email
}