import { Application } from "express";

export interface IServer 
{
    port: number;
    application: Application;
    host?: string;
    load_middlewares(): Promise<void>;
    load_routes(): Promise<void>;
    launch_server(): void;
}