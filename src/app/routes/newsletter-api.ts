import Router from "express";
import type { Express } from "express";
import { regitserSubscription } from "../controller/newsletter-Controller/version1/newsletter.controller.js";

const newsletterRouter: Express = Router();

newsletterRouter.post("/subscribe1", regitserSubscription);
newsletterRouter.post("/subscribe2",)

// newsletterRouter.get("/subscribers");

export default newsletterRouter;
