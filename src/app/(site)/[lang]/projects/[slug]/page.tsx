import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { getDictionary, getLocale } from "@/lib/dictionaries";
import { getPublishedProject, getPublishedSlugs } from "@/lib/projects";
import { formatPeriod } from "@/lib/dates";

/*
  Every published project is rendered to HTML at build time, once per locale.
  The database is read here and then not again until an admin edit revalidates
  the page — which is the whole reason Neon can stay asleep.
*/
export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProject(slug, await getLocale());

  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      type: "article",
    },
  };
}

export default async function ProjectPage({
  params,
}: PageProps<"/[lang]/projects/[slug]">) {
  const { slug } = await params;
  const lang = await getLocale();
  const dict = await getDictionary();
  const project = await getPublishedProject(slug, lang);

  // a slug that never existed. Both are a 404 — an unpublished project must not be reachable by guessing its URL.
  if (!project) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <header className="border-b border-rule pb-10">
        <h1 className="text-display font-normal">{project.title}</h1>
        <p className="mt-5 max-w-[56ch] text-lg text-ink-soft">
          {project.summary}
        </p>

        <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-3">
          <div>
            <dt className="label">{dict.projects.role}</dt>
            <dd className="mt-1 text-sm">{project.role}</dd>
          </div>
          <div>
            <dt className="label">{dict.projects.period}</dt>
            <dd className="mt-1 text-sm">
              {formatPeriod(
                project.startDate,
                project.endDate,
                lang,
                dict.projects.present,
              )}
            </dd>
          </div>
        </dl>

        {(project.liveUrl || project.repoUrl) && (
          <p className="mt-6 flex gap-6">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                className="label text-accent underline underline-offset-4"
              >
                {dict.projects.live}
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                className="label text-accent underline underline-offset-4"
              >
                {dict.projects.repo}
              </a>
            )}
          </p>
        )}
      </header>

      {/*
        react-markdown builds React elements rather than an HTML string, and
        ignores raw HTML in the source unless told otherwise — so there is no
        sanitising step to forget. It runs on the server; no JS ships for it.
      */}
      <div className="prose py-10">
        <Markdown remarkPlugins={[remarkGfm]}>{project.body}</Markdown>
      </div>

      {project.tags.length > 0 && (
        <ul className="flex flex-wrap gap-x-4 gap-y-2 border-t border-rule pt-6">
          {project.tags.map((tag) => (
            <li key={tag} className="label">
              {tag}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-12">
        <Link
          href={`/${lang}/projects`}
          className="label text-accent underline underline-offset-4"
        >
          {dict.projects.back}
        </Link>
      </p>
    </article>
  );
}
