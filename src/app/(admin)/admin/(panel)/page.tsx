import type { Metadata } from "next";

import { requireAdmin } from "@/lib/auth";
import { getAllProjectsForAdmin } from "@/lib/projects";

export const metadata: Metadata = { title: "Projects" };

export default async function AdminPage() {
  await requireAdmin();
  const projects = await getAllProjectsForAdmin();

  return (
    <>
      <h1 className="text-3xl">Projects</h1>

      <ul className="mt-12">
        {projects.map((project) => (
          <li
            key={project.id}
            className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-rule py-4"
          >
            <span>{project.titleEn}</span>
            <span className="label">
              {project.published ? "Published" : "Draft"} · {project.slug}
            </span>
          </li>
        ))}
      </ul>

      {projects.length === 0 && (
        <p className="mt-10 text-ink-soft">No projects yet.</p>
      )}
    </>
  );
}
