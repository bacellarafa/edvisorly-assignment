import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const submitFeedback = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      name: z.string().min(1).max(100),
      email: z.string().email().max(255),
      message: z.string().min(1).max(2000),
      page: z.string().max(200).optional(),
    })
  )
  .handler(async ({ data }) => {
    console.log("[Feedback received]", {
      name: data.name,
      email: data.email,
      message: data.message,
      page: data.page,
      receivedAt: new Date().toISOString(),
    });
    return { ok: true };
  });
