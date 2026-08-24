import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.microapps.title };
}

export default async function MicroappsPage() {
  const dict = await getDictionary();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-display font-normal">{dict.microapps.title}</h1>
      <p className="mt-8 text-ink-soft">{dict.microapps.placeholder}</p>
      
      {/* list of apps */}
    </div>
  );
}