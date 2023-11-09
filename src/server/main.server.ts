import { Application } from "express";
import { AbtsractServer } from "./abstract.server";
import { sequelize } from "../database/main.db";
// Third party modules
import express from "express";
import morgan from "morgan";
// Routes
import user_router from "../routers/user.routes";
import auth_router from "../routers/auth.routes";
import whooks_router from "../routers/whooks.router";
// Cron jobs
import send_report_hooks from "../cron/mailer.cron";
import {send_report_hooks_today} from "../cron/mailer.cron";


export class Server extends AbtsractServer
{
    constructor(port: number, application: Application)
    {
        super(port, application)
    }

    public async load_middlewares(): Promise<void> {
        this.application.use(express.json());
        this.application.use(express.urlencoded({ extended: true }));
        this.application.use(morgan("dev"));
    }

    public async load_routes(): Promise<void> {
        // User routes
        this.application.use("/api/user", user_router)
        // Auth routes
        this.application.use("/api/auth", auth_router)
        // Webhooks routes
        this.application.use("/api/whooks", whooks_router)
    }

    private async test_connection(): Promise<boolean>
    {
        try {
            await sequelize.authenticate();
            await sequelize.sync({alter: true})
            console.log('La conexión a la base de datos ha sido éxitosa.');
            return true;
          } catch (error) {
            console.error('No se puede conectar a la base de datos.:', error);
            return false;
          }
    }

    public async launch_server(): Promise<void> {

        await this.load_middlewares();
        await this.load_routes();

        if(!await this.test_connection())
        {
            throw new Error("No se pudo conectar a la base de datos");
        }

        send_report_hooks.start();
        //send_report_hooks_today.start();

        this.application.listen(this.port, () => {
            console.log(`Nos vamos a la luna. 🚀 Servidor corriendo en el puerto: ${this.port}`)
        })
        
    }

}