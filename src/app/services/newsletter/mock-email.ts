const attemptLogs = new Set();

export const mockEmail = async ({ email, subject, content, mode }) => {
  setTimeout(() => {}, 2000);

  if (mode === "fail") {
    throw new Error("Failed to send email to ", email);
  }

  if (mode === "fail-once") {
    if (!attemptLogs.has(email)) {
      attemptLogs.add(email);
      throw new Error("Failed to send email to ", email);
    }
    return {
      success: true,
      email,
      subject,
      message: content,
    };
  }

  return {
    success: true,
    email,
    subject,
    message: content,
  };
};
