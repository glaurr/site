import type { Metadata } from "next";

import { requireAdmin } from "@/lib/auth";
import { ProjectForm } from "../project-form";

export const metadata: Metadata = { title: "New project" };

export default async function NewProjectPage() {
  await requireAdmin();

  return (
    <>
      <h1 className="text-3xl">New project</h1>
      <ProjectForm />
    </>
  );
}
