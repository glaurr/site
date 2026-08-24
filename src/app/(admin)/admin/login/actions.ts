"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/lib/auth";
import { loginSchema } from "@/lib/schemas";

export async function login(values: unknown): Promise<{ error: string }> {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Email or password is not valid." };
  }

  try {
    await signIn("credentials", {
      ...parsed.data,
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Email or password is not correct." };
    }
    throw error;
  }

  return { error: "" };
}
