import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://agentclinic.example.com";

  const routes = [
    "",
    "/agents",
    "/ailments",
    "/therapies",
    "/appointments",
    "/appointments/new",
    "/staff",
    "/staff/login",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  return routes;
}
