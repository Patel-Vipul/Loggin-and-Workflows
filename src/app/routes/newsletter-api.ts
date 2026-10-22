import Router from "express";
import type { Express } from "express";

const newsletterRouter: Express = Router();

newsletterRouter.post("/subscribe");
newsletterRouter.get("/subscribers");

export default newsletterRouter;
