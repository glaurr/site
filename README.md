# Source Code for glaurr.com

This repository contains the full source code behind my personal website, portfolio, and integrated micro-apps. Built with bilingual support (English and Romanian).

🌐 **Live Website:** [glaurr.com](https://glaurr.com)

## 💡 About The Architecture

While the public-facing site is fully accessible, this repository exposes the custom infrastructure built behind the scenes. 

Everything on the public side is generated ahead of time and served statically. This ensures pages load immediately and the database stays asleep between edits. Content is written and managed through a private, custom-built admin panel rather than committed as markdown files — meaning publishing a new project takes zero deploys.

I deliberately chose to build this from scratch. There is no component library and no off-the-shelf CMS. The UI components, the forms, and the entire admin panel are hand-written to maintain absolute control over the bundle size, performance, and user experience.

## 🛠 Tech Stack

- **Framework:** Next.js (App Router) & TypeScript
- **Styling:** Tailwind CSS (Custom components only)
- **Database:** PostgreSQL with Prisma ORM
- **Storage:** Cloudflare R2
- **Hosting:** Vercel
