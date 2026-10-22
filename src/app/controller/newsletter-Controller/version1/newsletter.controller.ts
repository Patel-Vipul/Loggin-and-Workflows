import type { Request, Response } from "express";

import {
  mockemail,
  type mokeEmailOptions,
} from "../../../services/newsletter/mock-email.js";
import { pool } from "../../../db/pool.js";

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
  let lastEmailError: unknown;

  let emailData = {};
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
