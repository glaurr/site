"use client";

/*
  Unlike the project form there is nothing to go back to after saving, so the
  form stays on the page and says "Saved" until the text is changed again.
*/

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { aboutSchema, type AboutValues } from "@/lib/schemas";
import {
  LanguageTabs,
  TextArea,
  languages,
  useLanguageTabs,
} from "../form-fields";
import { saveAbout } from "./actions";

// the fields that exist once per language: descriptionEn, descriptionRo, ...
const translated = ["description", "body"] as const;

export function AboutForm({ defaultValues }: { defaultValues: AboutValues }) {
  const [serverError, setServerError] = useState("");
  const [saved, setSaved] = useState(false);
  const { language, setLanguage, onInvalid } = useLanguageTabs(translated);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<AboutValues>({
    resolver: zodResolver(aboutSchema),
    defaultValues,
  });

  async function onSubmit(values: AboutValues) {
    setServerError("");
    setSaved(false);

    const result = await saveAbout(values);
    if (result.error) {
      setServerError(result.error);
      return;
    }

    /*
      What was just saved becomes the new starting point, so isDirty turns
      true again — and "Saved" goes away — as soon as anything is edited.
    */
    reset(values);
    setSaved(true);
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
            <TextArea
              label="Description"
              hint="Shown under the title in search results and link previews. Up to 160 characters."
              rows={3}
              error={errors[`description${suffix}`]?.message}
              {...register(`description${suffix}`)}
            />
            <TextArea
              label="Text"
              hint="Written in Markdown"
              rows={20}
              className="font-mono text-sm"
              error={errors[`body${suffix}`]?.message}
              {...register(`body${suffix}`)}
            />
          </div>
        </fieldset>
      ))}

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
        {/* role="status": screen readers announce it without moving focus */}
        <p role="status" className="label">
          {saved && !isDirty && "Saved"}
        </p>
      </div>
    </form>
  );
}
