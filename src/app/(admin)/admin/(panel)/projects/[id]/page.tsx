import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { Project } from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/auth";
import { getProjectForAdmin } from "@/lib/projects";
import type { ProjectValues } from "@/lib/schemas";
import { DeleteProject } from "../delete-project";
import { ProjectForm } from "../project-form";

export const metadata: Metadata = { title: "Edit project" };

/*
  database shape -> form shape, the reverse of toProjectData in actions.ts.
  Listed field by field on purpose: only what the form edits is sent to the
  browser, and a Date cannot be handed to an <input> as it is.
*/
function toFormValues(project: Project): ProjectValues {
  return {
    slug: project.slug,
    titleEn: project.titleEn,
    titleRo: project.titleRo,
    summaryEn: project.summaryEn,
    summaryRo: project.summaryRo,
    bodyEn: project.bodyEn,
    bodyRo: project.bodyRo,
    role: project.role,
    // "2024-03-01T00:00:00.000Z" -> "2024-03-01"
    startDate: project.startDate.toISOString().slice(0, 10),
    endDate: project.endDate?.toISOString().slice(0, 10) ?? "",
    tags: project.tags.join(", "),
    liveUrl: project.liveUrl ?? "",
    repoUrl: project.repoUrl ?? "",
    published: project.published,
    sortOrder: project.sortOrder,
  };
}

export default async function EditProjectPage({
  params,
}: PageProps<"/admin/projects/[id]">) {
  await requireAdmin();

  const { id } = await params;
  const project = await getProjectForAdmin(id);
  if (!project) notFound();

  return (
    <>
      <h1 className="text-3xl">{project.titleEn}</h1>
      <ProjectForm id={project.id} defaultValues={toFormValues(project)} />

      <div className="mt-16 border-t border-rule pt-10">
        <DeleteProject id={project.id} />
      </div>
    </>
  );
}
