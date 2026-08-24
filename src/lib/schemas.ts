import { z } from "zod";

/*
  One schema, used in two places: the browser validates with it so the user
  gets an instant message, and the server validates with it again because
  anything arriving over the network is untrusted. Client-side validation is a
  convenience, never a control.
*/
export const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

export type LoginValues = z.infer<typeof loginSchema>;
