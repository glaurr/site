"use client";

/*
  "use client" because the form needs state: field errors as you type, and a
  disabled button while the request is in flight. React Hook Form keeps the
  inputs uncontrolled, so typing does not re-render the whole form.
*/

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, type LoginValues } from "@/lib/schemas";
import { login } from "./actions";

export function LoginForm() {
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginValues) {
    setServerError("");
    const result = await login(values);
    if (result.error) setServerError(result.error);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-10">
      <div>
        <label htmlFor="email" className="label">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          autoFocus
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="mt-2 w-full border-b border-rule bg-transparent py-2 outline-none focus:border-accent"
          {...register("email")}
        />
        {errors.email && (
          <p id="email-error" className="label mt-2 text-accent">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="mt-8">
        <label htmlFor="password" className="label">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={errors.password ? "password-error" : undefined}
          className="mt-2 w-full border-b border-rule bg-transparent py-2 outline-none focus:border-accent"
          {...register("password")}
        />
        {errors.password && (
          <p id="password-error" className="label mt-2 text-accent">
            {errors.password.message}
          </p>
        )}
      </div>

      {serverError && (
        // announced by screen readers when it appears, not only shown visually
        <p role="alert" className="label mt-8 text-accent">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="label mt-10 border border-ink px-6 py-3 hover:border-accent hover:text-accent disabled:opacity-50"
      >
        {isSubmitting ? "Signing in" : "Sign in"}
      </button>
    </form>
  );
}
