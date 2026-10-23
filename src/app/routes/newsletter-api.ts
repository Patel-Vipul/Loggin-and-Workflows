import Router from "express";
import type { Express } from "express";
import { regitserSubscription } from "../controller/newsletter-Controller/version1/newsletter.controller.js";
import { registerSubscription2 } from "../controller/newsletter-Controller/version2/newsletter.controller.js";

const newsletterRouter: Express = Router();

newsletterRouter.post("/subscribe1", regitserSubscription);
newsletterRouter.post("/subscribe2",registerSubscription2)

// newsletterRouter.get("/subscribers");

export default newsletterRouter;
