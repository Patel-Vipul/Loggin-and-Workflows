type modeOptions = "fail" | "fail-once" | "success";

interface mokeEmailOptions {
  email: string;
  subject: string;
  content: string;
  mode: modeOptions;
}

const attemptLogs = new Set<string>();

const mockemail = async ({
  email,
  content,
  subject,
  mode,
}: mokeEmailOptions) => {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 2000);
  });

  if (mode === "fail") throw new Error(`failed to send email to ${email}`);
  if (mode === "fail-once" && !attemptLogs.has(email)) {
    attemptLogs.add(email);
    throw new Error(`failed to send email to ${email}`);
  }

  return {
    success: true,
    email,
    subject,
    message: content,
    messageId: crypto.randomUUID(),
  };
};
