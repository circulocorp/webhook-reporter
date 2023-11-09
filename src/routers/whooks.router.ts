import express, { Request, Response, Router } from "express";
// Controllers
import { 
    e_not_delivered,
    get_whooks_of_this_day,
    download_report,
    get_whooks_of_this_day_by_email,
    receive_mails_stats,
    get_stats_of_this_day,
    get_stats_of_this_day_by_email
} from "../controllers/whook.controller";

const whooks_router: Router = express.Router();

whooks_router.get("/e-hooks", download_report)

whooks_router.post("/e-hooks", e_not_delivered);

whooks_router.post('/e-hooks/today', get_whooks_of_this_day)

whooks_router.post('/e-hooks/today/email', get_whooks_of_this_day_by_email)

// STATS

whooks_router.post('/e-hooks/stats', receive_mails_stats)

whooks_router.post('/e-hooks/stats/today', get_stats_of_this_day)

whooks_router.post('/e-hooks/stats/email', get_stats_of_this_day_by_email)

export default whooks_router;