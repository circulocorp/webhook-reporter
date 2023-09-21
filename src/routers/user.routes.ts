import express, { Request, Response, Router } from "express";
// Controllers
import { create_user } from "../controllers/user.controller";

const user_router: Router = express.Router();

user_router.get("/", (req: Request, res: Response) => {
  res.send("Hello from user router");
});

user_router.post("/create", create_user)

export default user_router;