/*
  The pieces every admin form is built from: labelled inputs, and the
  English/Romanian tabs. No "use client" here on purpose — only client
  components import this file, so it already runs in the browser. Marking it
  would turn `languages` into a reference if a server component imported it.
*/

import { useState, type ComponentProps, type ReactNode } from "react";

/*
  `suffix` is how a language shows up in a field name: titleEn, titleRo. Each
  form lists its translated fields once and draws one tab per language from
  this, instead of writing every field out twice.
*/
export const languages = [
  { code: "en", suffix: "En", name: "English" },
  { code: "ro", suffix: "Ro", name: "Romanian" },
] as const;

type Language = (typeof languages)[number];
export type LanguageCode = Language["code"];

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

export function TextField({
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

export function TextArea({
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

/*
  `fields` are the translated fields without their suffix: ["title", "body"]
  means titleEn and bodyEn on the English tab. `errors` is the form's errors
  object, which only holds the fields that failed.
*/
type Errors = Record<string, unknown>;

function hasErrors(
  errors: Errors,
  fields: readonly string[],
  language: Language,
) {
  return fields.some((field) => Boolean(errors[`${field}${language.suffix}`]));
}

export function useLanguageTabs(fields: readonly string[]) {
  const [language, setLanguage] = useState<LanguageCode>("en");

  /*
    For handleSubmit's second argument, which runs when the browser-side check
    fails. A mistake in the language that is currently hidden would be
    invisible, so switch to the tab that has one.
  */
  function onInvalid(errors: Errors) {
    const current = languages.find((item) => item.code === language);
    if (current && hasErrors(errors, fields, current)) return;

    const failed = languages.find((item) => hasErrors(errors, fields, item));
    if (failed) setLanguage(failed.code);
  }

  return { language, setLanguage, onInvalid };
}

export function LanguageTabs({
  fields,
  errors,
  language,
  onSelect,
}: {
  fields: readonly string[];
  errors: Errors;
  language: LanguageCode;
  onSelect: (code: LanguageCode) => void;
}) {
  return (
    <div className="flex gap-6 border-b border-rule">
      {languages.map((item) => (
        <button
          key={item.code}
          type="button"
          aria-pressed={language === item.code}
          onClick={() => onSelect(item.code)}
          className={`label -mb-px cursor-pointer border-b py-3 ${
            language === item.code
              ? "border-accent text-accent"
              : "border-transparent hover:text-accent"
          }`}
        >
          {item.name}
          {hasErrors(errors, fields, item) && " — has errors"}
        </button>
      ))}
    </div>
  );
}
