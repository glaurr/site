"use client";

/*
  One form for both "new" and "edit". The only differences are the values it
  starts with and which server action receives the result — an `id` means
  there is an existing project to update.
*/

import { useState, type ComponentProps, type ReactNode } from "react";
import Link from "next/link";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { projectSchema, type ProjectValues } from "@/lib/schemas";
import { createProject, updateProject } from "./actions";

/*
  `suffix` is how a language shows up in a field name: titleEn, titleRo. The
  two language tabs are the same three fields, so they are drawn from this
  list instead of being written out twice.
*/
const languages = [
  { code: "en", suffix: "En", name: "English" },
  { code: "ro", suffix: "Ro", name: "Romanian" },
] as const;

type LanguageCode = (typeof languages)[number]["code"];

const emptyProject: ProjectValues = {
  slug: "",
  titleEn: "",
  titleRo: "",
  summaryEn: "",
  summaryRo: "",
  bodyEn: "",
  bodyRo: "",
  role: "",
  startDate: "",
  endDate: "",
  tags: "",
  liveUrl: "",
  repoUrl: "",
  published: false,
  sortOrder: 0,
};

type FieldProps = {
  label: string;
  error?: string;
  hint?: string;
};

// label, then the input, then either the error or the hint underneath
function Field({
  id,
  label,
  error,
  hint,
  children,
}: FieldProps & { id?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="label mt-2 text-accent">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="label mt-2">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

// ties the input to whichever message is showing, for screen readers
function describedBy(id?: string, error?: string, hint?: string) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

function TextField({
  label,
  error,
  hint,
  ...input
}: FieldProps & ComponentProps<"input">) {
  const id = input.name;

  return (
    <Field id={id} label={label} error={error} hint={hint}>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className="mt-2 w-full border-b border-rule bg-transparent py-2 outline-none focus:border-accent"
        {...input}
      />
    </Field>
  );
}

function TextArea({
  label,
  error,
  hint,
  className = "",
  ...textarea
}: FieldProps & ComponentProps<"textarea">) {
  const id = textarea.name;

  return (
    <Field id={id} label={label} error={error} hint={hint}>
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={`mt-2 block w-full border border-rule bg-transparent p-3 outline-none focus:border-accent ${className}`}
        {...textarea}
      />
    </Field>
  );
}

export function ProjectForm({
  id,
  defaultValues = emptyProject,
}: {
  id?: string;
  defaultValues?: ProjectValues;
}) {
  const [serverError, setServerError] = useState("");
  const [language, setLanguage] = useState<LanguageCode>("en");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectValues>({
    resolver: zodResolver(projectSchema),
    defaultValues,
  });

  function hasErrors(
    fieldErrors: FieldErrors<ProjectValues>,
    suffix: "En" | "Ro",
  ) {
    return Boolean(
      fieldErrors[`title${suffix}`] ||
      fieldErrors[`summary${suffix}`] ||
      fieldErrors[`body${suffix}`],
    );
  }

  async function onSubmit(values: ProjectValues) {
    setServerError("");
    const result = id
      ? await updateProject(id, values)
      : await createProject(values);
    if (result.error) setServerError(result.error);
  }

  /*
    Runs when the browser-side check fails. A mistake in the language that is
    currently hidden would be invisible, so switch to the tab that has one.
  */
  function onInvalid(fieldErrors: FieldErrors<ProjectValues>) {
    const current = languages.find((item) => item.code === language);
    if (current && hasErrors(fieldErrors, current.suffix)) return;

    const failed = languages.find((item) =>
      hasErrors(fieldErrors, item.suffix),
    );
    if (failed) setLanguage(failed.code);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      noValidate
      className="mt-10"
    >
      <div className="flex gap-6 border-b border-rule">
        {languages.map(({ code, suffix, name }) => (
          <button
            key={code}
            type="button"
            aria-pressed={language === code}
            onClick={() => setLanguage(code)}
            className={`label -mb-px cursor-pointer border-b py-3 ${
              language === code
                ? "border-accent text-accent"
                : "border-transparent hover:text-accent"
            }`}
          >
            {name}
            {hasErrors(errors, suffix) && " — has errors"}
          </button>
        ))}
      </div>

      {/*
        Both languages stay in the page the whole time and one is hidden, so
        switching tabs loses nothing and saving checks both.
      */}
      {languages.map(({ code, suffix, name }) => (
        <fieldset key={code} hidden={language !== code}>
          <legend className="sr-only">{name}</legend>

          <div className="mt-8 grid gap-8">
            <TextField
              label="Title"
              error={errors[`title${suffix}`]?.message}
              {...register(`title${suffix}`)}
            />
            <TextArea
              label="Summary"
              rows={3}
              error={errors[`summary${suffix}`]?.message}
              {...register(`summary${suffix}`)}
            />
            <TextArea
              label="Text"
              hint="Written in Markdown"
              rows={16}
              className="font-mono text-sm"
              error={errors[`body${suffix}`]?.message}
              {...register(`body${suffix}`)}
            />
          </div>
        </fieldset>
      ))}

      <div className="mt-12 grid gap-8 border-t border-rule pt-10">
        <TextField
          label="Slug"
          hint="The last part of the address — /en/projects/your-slug"
          error={errors.slug?.message}
          {...register("slug")}
        />
        <TextField
          label="Role"
          error={errors.role?.message}
          {...register("role")}
        />

        <div className="grid gap-8 sm:grid-cols-2">
          <TextField
            label="Start date"
            type="date"
            error={errors.startDate?.message}
            {...register("startDate")}
          />
          <TextField
            label="End date"
            type="date"
            hint="Leave empty if it is still going"
            error={errors.endDate?.message}
            {...register("endDate")}
          />
        </div>

        <TextField
          label="Tags"
          hint="Separated by commas"
          error={errors.tags?.message}
          {...register("tags")}
        />
        <TextField
          label="Live address"
          type="url"
          error={errors.liveUrl?.message}
          {...register("liveUrl")}
        />
        <TextField
          label="Repository address"
          type="url"
          error={errors.repoUrl?.message}
          {...register("repoUrl")}
        />
        <TextField
          label="Position in the list"
          type="number"
          hint="Lower numbers come first"
          error={errors.sortOrder?.message}
          // without this the browser hands over "3" as text, not the number 3
          {...register("sortOrder", { valueAsNumber: true })}
        />

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            className="size-4 accent-accent"
            {...register("published")}
          />
          <span className="label">Published — visible on the public site</span>
        </label>
      </div>

      {serverError && (
        <p role="alert" className="label mt-8 text-accent">
          {serverError}
        </p>
      )}

      <div className="mt-10 flex flex-wrap items-center gap-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="label cursor-pointer border border-ink px-6 py-3 hover:border-accent hover:text-accent disabled:opacity-50"
        >
          {isSubmitting ? "Saving" : "Save"}
        </button>
        <Link href="/admin" className="label hover:text-accent">
          Cancel
        </Link>
      </div>
    </form>
  );
}
