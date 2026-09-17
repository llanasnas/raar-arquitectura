import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/content";
import { routes, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}${routes.projects}`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}${routes.services}`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}${routes.studio}`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${site.url}${routes.contact}`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
  ];
  const projects: MetadataRoute.Sitemap = getProjects()
    .filter((p) => p.status === "published")
    .map((p) => ({ url: `${site.url}${routes.project(p.id)}`, lastModified: now, changeFrequency: "yearly", priority: 0.7 }));
  return [...staticRoutes, ...projects];
}
