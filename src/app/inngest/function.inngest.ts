import { mockemail } from "../services/newsletter/mock-email.js";
import { inngest } from "./client.inngest.js";

export const registerSubscription = inngest.createFunction(
  {
    id: "newsletter-api/subscription",
    triggers: [{ event: "newsletter-api/subscription.registered" }],
  },
  async ({ event, step }) => {
    const { email, content, subject, mode, subscriberId } = event.data;

    const emailResult = await step.run("send-email", async () => {
      return await mockemail({ email, content, subject, mode });
    });

    return {
      success: true,
      subscriberId,
      emailStatus: "sent",
      data: emailResult,
    };
  },
);
