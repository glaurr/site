import Link from "next/link";

import { requireAdmin } from "@/lib/auth";
import { getAllProjectsForAdmin } from "@/lib/projects";
import { logout } from "./actions";

export default async function AdminPage() {
  const session = await requireAdmin();
  const projects = await getAllProjectsForAdmin();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="text-3xl">Projects</h1>

        <form action={logout}>
          <button type="submit" className="label hover:text-accent">
            Sign out — {session.user?.email}
          </button>
        </form>
      </div>

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

      <p className="mt-12">
        <Link href="/en" className="label text-accent underline underline-offset-4">
          Back to the site
        </Link>
      </p>
    </main>
  );
}
