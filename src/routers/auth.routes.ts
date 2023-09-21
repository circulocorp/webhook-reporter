import express, { Request, Response, Router } from "express";
// Controllers
import { login_user } from "../controllers/auth.controller";


const auth_router: Router = express.Router();

auth_router.post("/login", login_user)

export default auth_router;