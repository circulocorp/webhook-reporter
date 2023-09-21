import { IServer } from "../interfaces/main.interfaces";
import { Application } from "express";

export class AbtsractServer implements IServer
{
    public port: number;
    public application: Application;

    constructor(port: number, application: Application)
    {
        this.port = port;
        this.application = application;
    }

    public async load_middlewares(): Promise<void>
    {
        console.log("Cargando middlewares...")
    }

    public async load_routes(): Promise<void>
    {
        console.log("Cargando rutas...")
    }

    public async launch_server(): Promise<void>
    {
        console.log("Lanzando servidor...")
    }
}