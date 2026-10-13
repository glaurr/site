"use client";

/*
  Deleting cannot be undone, so it takes two clicks. The first only swaps the
  button for a question; the second, on a different button, does it.
*/

import { useState, useTransition } from "react";

import { deleteProject } from "./actions";

// "kept" is "idle" again, except focus goes back to the button it left
type Step = "idle" | "asking" | "kept";

export function DeleteProject({ id }: { id: string }) {
  const [step, setStep] = useState<Step>("idle");
  const [isDeleting, startDeleting] = useTransition();

  if (step !== "asking") {
    return (
      <button
        type="button"
        autoFocus={step === "kept"}
        onClick={() => setStep("asking")}
        className="label cursor-pointer hover:text-accent"
      >
        Delete project
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-6">
      {/* the question sits where the button was, so a double click lands on text */}
      <p id="delete-question" className="label">
        Delete this project for good?
      </p>
      <button
        type="button"
        // keyboard focus lands on the safe choice
        autoFocus
        aria-describedby="delete-question"
        disabled={isDeleting}
        onClick={() => setStep("kept")}
        className="label cursor-pointer hover:text-accent disabled:opacity-50"
      >
        Keep it
      </button>
      <button
        type="button"
        disabled={isDeleting}
        onClick={() => startDeleting(() => deleteProject(id))}
        className="label cursor-pointer border border-accent px-6 py-3 text-accent disabled:opacity-50"
      >
        {isDeleting ? "Deleting" : "Delete"}
      </button>
    </div>
  );
}
