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
  const emailresult = await mockemail({ email, content, subject, mode });

  //return response
  return res.status(201).json({
    success: true,
    subscribtionId: insertResult.rows[0],
    data: emailresult,
  });
};
