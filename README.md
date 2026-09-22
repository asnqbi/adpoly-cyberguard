# ADPoly CyberGuard

A responsive Next.js, TypeScript, and Tailwind CSS portfolio using the supplied team logo, portraits, and brief.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:3000.

```sh
npm run typecheck
npm test
npm run build
npm start
```

## Update content

- `data/team.ts`: names, roles, photos, biographies, skills, certifications, and optional LinkedIn/GitHub/email links. Each member has a generated profile page.
- `data/projects.ts`: project case studies, technologies, workflow steps, and images. Each project has a generated detail page.
- `data/achievements.ts`: add achievements to the timeline.
- `data/competitions.ts`: reusable competition entries and filter categories. Add verified dates, organizers, locations, and website links here.
- `data/gallery.ts`: gallery photographs and captions; images open in a keyboard-accessible full-screen viewer.
- `data/site.ts`: contact links, team information, organizations, and expertise.
- `public/assets/`: copied original logo and photos; `achievements/` and `projects/` are ready for future assets. Original files at the project root are preserved.

## Contact form

The form submits validated messages to Supabase through `/api/contact`. Approved Supabase Auth admins can manage them at `/admin/messages`: search, filter, sort, view full messages, mark read/contacted, and delete. Database RLS blocks all public reads, updates, and deletes.

**Follow [SUPABASE_SETUP.md](SUPABASE_SETUP.md) to create the project, run the migration, configure environment variables, and grant admin access.** Until configured, submissions display an error and are not saved. No service-role key is needed by the application.

## Publish

Deploy as a standard Next.js application to a Node.js host or Vercel. Set `NEXT_PUBLIC_SITE_URL` to the actual HTTPS site address before building (see `.env.example`) so canonical links, Open Graph image URLs, robots, and the sitemap use the production domain. No site has been deployed automatically.

## Content accuracy

Only the supplied 2026 achievement is shown. Missing member biographies, certifications, competition metadata, contact URLs, project stack, screenshots, and measured performance results are not invented. The project architecture is clearly labeled conceptual. Related organizations are explicitly not described as official sponsors. Team portraits are used in the gallery until event photos are supplied. The provided spelling “Ahmed Alhosani” in the brief is used over the image filename.

## Accessibility and behavior

Includes semantic sections, a skip link, keyboard focus styles, mobile navigation with Escape support, native form validation, reduced-motion support, and a modal photo viewer with arrow-key navigation and focus restoration. Content remains visible if animation scripts are unavailable.
