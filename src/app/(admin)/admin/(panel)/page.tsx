import Link from "next/link";
import type { Metadata } from "next";

import { requireAdmin } from "@/lib/auth";
import { getAllProjectsForAdmin } from "@/lib/projects";

export const metadata: Metadata = { title: "Projects" };

export default async function AdminPage() {
  await requireAdmin();
  const projects = await getAllProjectsForAdmin();

  return (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
        <h1 className="text-3xl">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="label text-accent underline underline-offset-4"
        >
          New project
        </Link>
      </div>

      <ul className="mt-12">
        {projects.map((project) => (
          <li
            key={project.id}
            className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-rule py-4"
          >
            <Link
              href={`/admin/projects/${project.id}`}
              className="hover:text-accent"
            >
              {project.titleEn}
            </Link>
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
