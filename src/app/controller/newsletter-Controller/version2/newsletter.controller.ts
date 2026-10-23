import { inngest } from "../../../inngest/client.inngest.js";

import type { Request, Response } from "express";
import type { mokeEmailOptions } from "../../../services/newsletter/mock-email.js";

import { pool } from "../../../db/pool.js";

export const registerSubscription2 = async (req: Request, res: Response) => {
  const { email, content, subject, mode }: mokeEmailOptions = req?.body;

  //validate the input
  if (
    !email ||
    !content ||
    !subject ||
    !mode ||
    email.trim() === "" ||
    content.trim() === "" ||
    subject.trim() === "" ||
    mode.trim() === ""
  ) {
    return res.status(400).json({
      error: "bad request!",
      message: "Missing required fields",
    });
  }

  const id = crypto.randomUUID();

  const insertQuery = `
        INSERT INTO Subscribers(id, email)
        VALUES($1,$2)
        RETURNING id
        `;

  const insertResult = await pool.query(insertQuery, [id, email]);

  if (insertResult.rows.length === 0) {
    return res.status(500).json({
      error: "Internal server error",
      message: "Error while inserting in databse",
    });
  }

  const subscriber = insertResult.rows[0];

  await inngest.send({
    name: "newsletter-api/subscription.registered",
    data: {
      email,
      content,
      subject,
      mode,
      subscriberId: subscriber.id,
    },
  });

  return res.status(201).json({
    success: true,
    message: "Subscription created",
    data: subscriber,
  });
};
