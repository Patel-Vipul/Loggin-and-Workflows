import express from "express";
import { serve } from "inngest/express";

import type { Express } from "express";

import { inngest } from "./inngest/client.inngest.js";

import newsletterRouter from "./routes/newsletter-api.js";
import { registerSubscription } from "./inngest/function.inngest.js";


export const expressApplication = (): Express => {
  const app = express();

  //middlewares
  app.use(express.json());

  //inngest api route
  app.use(
    "/api/inngest",
    serve({
      client: inngest,
      functions: [registerSubscription],
    }),
  );

  //registered routes
  app.get("/health", (_, res) => {
    return res.status(200).json({
      healthy: true,
    });
  });

  app.use("/newsletter-api/", newsletterRouter);

  return app;
};
