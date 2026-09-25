import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/content";
import { getPosts, getZones } from "@/lib/editorial";
import { offGridEntries } from "@/lib/off-grid";
import { routes, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const posts = getPosts();
  const zones = getZones();
  const lastPost = posts[0]?.updated ? new Date(posts[0].updated) : now;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}${routes.projects}`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}${routes.services}`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}${routes.zones}`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}${routes.studio}`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${site.url}${routes.offgrid}`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}${routes.contact}`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    { url: `${site.url}${routes.blog}`, lastModified: lastPost, changeFrequency: "weekly", priority: 0.7 },
  ];
  const zonePages: MetadataRoute.Sitemap = zones.map((z) => ({
    url: `${site.url}${routes.zone(z.slug)}`,
    lastModified: z.updated ? new Date(z.updated) : now,
    changeFrequency: "monthly",
    priority: 0.85,
  }));
  const postPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${site.url}${routes.post(p.slug)}`,
    lastModified: new Date(p.updated),
    changeFrequency: "monthly",
    priority: 0.6,
  }));
  const projects: MetadataRoute.Sitemap = getProjects()
    .filter((p) => p.status === "published")
    .map((p) => ({ url: `${site.url}${routes.project(p.id)}`, lastModified: now, changeFrequency: "yearly", priority: 0.7 }));
  const offGridPages: MetadataRoute.Sitemap = offGridEntries.map((entry) => ({
    url: `${site.url}${routes.offgrid}/${entry.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));
  return [...staticRoutes, ...zonePages, ...postPages, ...projects, ...offGridPages];
}
