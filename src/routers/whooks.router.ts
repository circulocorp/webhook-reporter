import express, { Request, Response, Router } from "express";
// Controllers
import { 
    e_not_delivered,
    get_whooks_of_this_day,
    download_report,
    get_whooks_of_this_day_by_email
} from "../controllers/whook.controller";

const whooks_router: Router = express.Router();

whooks_router.get("/e-hooks", download_report)

whooks_router.post("/e-hooks", e_not_delivered);

whooks_router.post('/e-hooks/today', get_whooks_of_this_day)

whooks_router.post('/e-hooks/today/email', get_whooks_of_this_day_by_email)

export default whooks_router;