import type { Request, Response } from "express";

import {
  mockemail,
  type mokeEmailOptions,
} from "../../../services/newsletter/mock-email.js";
import { pool } from "../../../db/pool.js";

const delay = async (duration: number): Promise<void> => {
  return new Promise<void>((resolve) =>
    setTimeout(() => {
      resolve();
    }, duration),
  );
};

export const regitserSubscription = async (req: Request, res: Response) => {
  //get the input
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
  //save in db
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

  //send email
  //   const emailresult = await mockemail({ email, content, subject, mode });

  //send email with retrices mechanism
  const maxattempt = 3;

  let emailStatus: "sent" | "failed" = "failed";
  let emailResult: Awaited<ReturnType<typeof mockemail>> | null = null;
  let emailData = {};

  const baseDelay = 1000;
  const maxDelay = 8000;

  for (let attempt = 1; attempt <= maxattempt; attempt++) {
    try {
      emailResult = await mockemail({ email, content, mode, subject });
      emailStatus = "sent";
      emailData = {
        status: emailStatus,
        attempt,
        data: emailResult,
        message: "email has been sent",
      };
      break;
    } catch (error) {
      emailData = {
        status: emailStatus,
        attempt,
        message: "Email could not be delivered",
        error,
      };
      console.error(`email attempt ${attempt}/${maxattempt} failed`, error);

      if (attempt < maxattempt) {
        const exponentialDelay = Math.min(
          maxDelay,
          baseDelay * 2 ** (attempt - 1),
        );
        const waitTime = Math.random() * exponentialDelay;
        console.log(`Next retry in ${waitTime / 1000} seconds...`);
        await delay(waitTime);
      }
    }
  }

  //return response
  return res.status(201).json({
    success: true,
    message: "subscription created successfully!",
    subscribtionId: insertResult.rows[0].id,
    email: emailData,
  });
};
