import Link from "next/link";
import type { Metadata } from "next";

import { requireAdmin } from "@/lib/auth";
import { getSiteTextForAdmin } from "@/lib/site-content";
import { AboutForm } from "./about-form";

export const metadata: Metadata = { title: "About" };

export default async function AdminAboutPage() {
  await requireAdmin();

  const [body, description] = await Promise.all([
    getSiteTextForAdmin("about.body"),
    getSiteTextForAdmin("about.description"),
  ]);

  return (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
        <h1 className="text-3xl">About</h1>
        <Link
          href="/en/about"
          className="label text-accent underline underline-offset-4"
        >
          View page
        </Link>
      </div>

      <AboutForm
        defaultValues={{
          bodyEn: body.en,
          bodyRo: body.ro,
          descriptionEn: description.en,
          descriptionRo: description.ro,
        }}
      />
    </>
  );
}
