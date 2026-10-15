"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { Prisma } from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { projectSchema, type ProjectValues } from "@/lib/schemas";

const invalid = "Some fields are not valid.";
const slugTaken = "Another project already uses that slug.";

// form shape -> database shape. The only place the two are translated.
function toProjectData(values: ProjectValues) {
  const { startDate, endDate, tags, liveUrl, repoUrl, ...rest } = values;

  return {
    ...rest,
    startDate: new Date(startDate),
    endDate: endDate ? new Date(endDate) : null,
    tags: tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    liveUrl: liveUrl || null,
    repoUrl: repoUrl || null,
  };
}

// P2002 is Prisma's code for a broken unique constraint; slug is the only one
function isSlugTaken(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

/*
  The public pages are static HTML built from the database. This throws that
  HTML away for every page, in both languages; each one is rebuilt from the
  database the next time someone visits it.
*/
function revalidateSite() {
  revalidatePath("/", "layout");
}

export async function createProject(
  values: unknown,
): Promise<{ error: string }> {
  await requireAdmin();

  const parsed = projectSchema.safeParse(values);
  if (!parsed.success) return { error: invalid };

  try {
    await prisma.project.create({ data: toProjectData(parsed.data) });
  } catch (error) {
    if (isSlugTaken(error)) return { error: slugTaken };
    throw error;
  }

  revalidateSite();
  redirect("/admin");
}

export async function updateProject(
  id: string,
  values: unknown,
): Promise<{ error: string }> {
  await requireAdmin();

  const parsed = projectSchema.safeParse(values);
  if (!parsed.success) return { error: invalid };

  try {
    await prisma.project.update({
      where: { id },
      data: toProjectData(parsed.data),
    });
  } catch (error) {
    if (isSlugTaken(error)) return { error: slugTaken };
    throw error;
  }

  revalidateSite();
  redirect("/admin");
}

export async function deleteProject(id: string): Promise<void> {
  await requireAdmin();

  /*
    deleteMany rather than delete: it does nothing when the project is already
    gone (a second tab, a slow double click) instead of throwing. The project's
    images go with it — onDelete: Cascade in the schema.
  */
  await prisma.project.deleteMany({ where: { id } });

  revalidateSite();
  redirect("/admin");
}
