import { prisma } from "./prisma";
import type { Locale } from "./locales";

/*
  Queries live here rather than in the pages, so a page never decides what
  "published" means. Every read on the public site goes through one of these.

  These run at build time, not per visit — the pages that call them are
  statically generated, and admin writes revalidate them afterwards.
*/

export type ProjectListItem = {
  slug: string;
  title: string;
  summary: string;
  role: string;
  startDate: Date;
  endDate: Date | null;
  tags: string[];
};

export async function getPublishedProjects(
  lang: Locale,
): Promise<ProjectListItem[]> {
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }],
    select: {
      slug: true,
      titleEn: true,
      titleRo: true,
      summaryEn: true,
      summaryRo: true,
      role: true,
      startDate: true,
      endDate: true,
      tags: true,
    },
  });

  return projects.map((project) => ({
    slug: project.slug,
    title: lang === "ro" ? project.titleRo : project.titleEn,
    summary: lang === "ro" ? project.summaryRo : project.summaryEn,
    role: project.role,
    startDate: project.startDate,
    endDate: project.endDate,
    tags: project.tags,
  }));
}

export async function getAllProjectsForAdmin() {
  return prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }],
    select: {
      id: true,
      slug: true,
      titleEn: true,
      published: true,
      updatedAt: true,
    },
  });
}

export async function getPublishedSlugs(): Promise<string[]> {
  const projects = await prisma.project.findMany({
    where: { published: true },
    select: { slug: true },
  });

  return projects.map((project) => project.slug);
}

export async function getPublishedProject(slug: string, lang: Locale) {
  /*
    `published: true` is part of the query, not a check afterwards. A draft is
    then unreachable by guessing its URL, which is the requirement — hiding it
    from the list would not be enough.
  */
  const project = await prisma.project.findFirst({
    where: { slug, published: true },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!project) return null;

  return {
    slug: project.slug,
    title: lang === "ro" ? project.titleRo : project.titleEn,
    summary: lang === "ro" ? project.summaryRo : project.summaryEn,
    body: lang === "ro" ? project.bodyRo : project.bodyEn,
    role: project.role,
    startDate: project.startDate,
    endDate: project.endDate,
    tags: project.tags,
    liveUrl: project.liveUrl,
    repoUrl: project.repoUrl,
    images: project.images,
  };
}
