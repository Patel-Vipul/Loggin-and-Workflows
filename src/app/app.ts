import express from "express"

import type { Express } from "express";

export const expressApplication = () : Express => {
    const app = express()

    //middlewares

    //registered routes
    app.get("/health", (_, res) => {
        return res.status(200).json({
            healthy : true
        })
    })

    return app;
}