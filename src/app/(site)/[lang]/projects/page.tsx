import Link from "next/link";
import type { Metadata } from "next";

import { getDictionary, getLocale } from "@/lib/dictionaries";
import { getPublishedProjects } from "@/lib/projects";
import { formatPeriod } from "@/lib/dates";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.projects.title };
}

export default async function ProjectsPage() {
  const lang = await getLocale();
  const dict = await getDictionary();
  const projects = await getPublishedProjects(lang);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-display font-normal">{dict.projects.title}</h1>

      {projects.length === 0 ? (
        <p className="mt-10 text-ink-soft">{dict.projects.empty}</p>
      ) : (
        <ol className="mt-12">
          {projects.map((project, index) => (
            <li key={project.slug} className="border-t border-rule">
              <Link
                href={`/${lang}/projects/${project.slug}`}
                className="group flex gap-6 py-8"
              >
                <span className="label pt-2 tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div>
                  <h2 className="text-2xl group-hover:text-accent">
                    {project.title}
                  </h2>
                  <p className="mt-2 max-w-[56ch] text-ink-soft">
                    {project.summary}
                  </p>
                  <p className="label mt-3">
                    {formatPeriod(
                      project.startDate,
                      project.endDate,
                      lang,
                      dict.projects.present,
                    )}
                    {" · "}
                    {project.role}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
