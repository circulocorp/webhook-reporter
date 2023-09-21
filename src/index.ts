import express, {Express} from "express";
import { Server } from "./server/main.server";
import dotenv from "dotenv";

dotenv.config();

const application: Express = express();

const server = new Server(3000, application)

server.launch_server();