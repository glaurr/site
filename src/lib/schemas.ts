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

/*
  The project form. Every value stays in the shape the inputs produce —
  strings, one boolean, one number — so the same object is checked in the
  browser and again on the server with nothing converted in between. Turning
  "2024-03-01" into a Date and "a, b" into a list happens once, in the server
  action, after this has passed.
*/
const optionalUrl = z.union([
  z.literal(""),
  // http and https only: these end up in an href on the public site
  z.httpUrl("Enter a full address starting with https://"),
]);

export const projectSchema = z
  .object({
    slug: z
      .string()
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Lowercase letters, numbers and single hyphens only",
      ),

    titleEn: z.string().trim().min(1, "Enter the English title"),
    titleRo: z.string().trim().min(1, "Enter the Romanian title"),
    summaryEn: z.string().trim().min(1, "Enter the English summary"),
    summaryRo: z.string().trim().min(1, "Enter the Romanian summary"),
    bodyEn: z.string().trim().min(1, "Enter the English text"),
    bodyRo: z.string().trim().min(1, "Enter the Romanian text"),

    role: z.string().trim().min(1, "Enter your role"),
    // "2024-03-01", which is what <input type="date"> produces
    startDate: z.iso.date("Pick a start date"),
    endDate: z.union([z.literal(""), z.iso.date("Pick a valid end date")]),

    // one text input, split on commas in the server action
    tags: z.string(),

    liveUrl: optionalUrl,
    repoUrl: optionalUrl,

    published: z.boolean(),
    sortOrder: z.number("Enter a whole number").int("Enter a whole number"),
  })
  // dates in this format sort the same as text, so a plain comparison works
  .refine((values) => !values.endDate || values.endDate >= values.startDate, {
    path: ["endDate"],
    message: "The end date cannot be before the start date",
  });

export type ProjectValues = z.infer<typeof projectSchema>;

/*
  The About page: Markdown text plus a short description, in both languages.
  The description is what search results and link previews show under the
  title; past about 160 characters they cut it off.
*/
const description = (language: string) =>
  z
    .string()
    .trim()
    .min(1, `Enter the ${language} description`)
    .max(160, "Keep it under 160 characters");

export const aboutSchema = z.object({
  bodyEn: z.string().trim().min(1, "Enter the English text"),
  bodyRo: z.string().trim().min(1, "Enter the Romanian text"),
  descriptionEn: description("English"),
  descriptionRo: description("Romanian"),
});

export type AboutValues = z.infer<typeof aboutSchema>;
