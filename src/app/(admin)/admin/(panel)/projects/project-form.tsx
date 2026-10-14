"use client";

/*
  One form for both "new" and "edit". The only differences are the values it
  starts with and which server action receives the result — an `id` means
  there is an existing project to update.
*/

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { projectSchema, type ProjectValues } from "@/lib/schemas";
import {
  LanguageTabs,
  TextArea,
  TextField,
  languages,
  useLanguageTabs,
} from "../form-fields";
import { createProject, updateProject } from "./actions";

// the fields that exist once per language: titleEn, titleRo, ...
const translated = ["title", "summary", "body"] as const;

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

export function ProjectForm({
  id,
  defaultValues = emptyProject,
}: {
  id?: string;
  defaultValues?: ProjectValues;
}) {
  const [serverError, setServerError] = useState("");
  const { language, setLanguage, onInvalid } = useLanguageTabs(translated);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectValues>({
    resolver: zodResolver(projectSchema),
    defaultValues,
  });

  async function onSubmit(values: ProjectValues) {
    setServerError("");
    const result = id
      ? await updateProject(id, values)
      : await createProject(values);
    if (result.error) setServerError(result.error);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      noValidate
      className="mt-10"
    >
      <LanguageTabs
        fields={translated}
        errors={errors}
        language={language}
        onSelect={setLanguage}
      />

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
