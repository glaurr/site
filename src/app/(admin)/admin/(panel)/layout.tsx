import Link from "next/link";

import { requireAdmin } from "@/lib/auth";
import { logout } from "./actions";

export default async function AdminPanelLayout({
  children,
}: LayoutProps<"/admin">) {
  const session = await requireAdmin();

  return (
    <>
      <header className="border-b border-rule">
        <div className="mx-auto flex max-w-3xl flex-wrap items-baseline justify-between gap-x-6 gap-y-3 px-6 py-5">
          <Link href="/admin" className="font-mono text-sm hover:text-accent">
            Admin
          </Link>

          <nav className="flex flex-wrap items-baseline gap-x-6 gap-y-3">
            <Link href="/admin" className="label hover:text-accent">
              Projects
            </Link>
            <Link href="/en" className="label hover:text-accent">
              View site
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="label cursor-pointer hover:text-accent"
              >
                Sign out — {session.user?.email}
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">{children}</main>
    </>
  );
}
