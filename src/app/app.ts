import express from "express"

import type { Express } from "express";

import newsletterRouter from "./routes/newsletter-api.js"; "./routes/newsletter-api.js";

export const expressApplication = () : Express => {
    const app = express()

    //middlewares
    app.use(express.json())

    //registered routes
    app.get("/health", (_, res) => {
        return res.status(200).json({
            healthy : true
        })
    })

    app.use("/newsletter-api/",newsletterRouter)

    return app;
}