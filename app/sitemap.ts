import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { team } from "@/data/team";
export default function sitemap(): MetadataRoute.Sitemap {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (!url) return [];
  const base = url.replace(/\/$/, "");
  return [
    { url: base, priority: 1 },
    ...projects.map((p) => ({
      url: `${base}/projects/${p.id}`,
      priority: 0.8,
    })),
    ...team.map((m) => ({ url: `${base}/team/${m.id}`, priority: 0.6 })),
  ];
}
