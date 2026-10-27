type PreviewSection = "home" | "projects" | "writing" | "resume" | "article";

export function openGraphImage(title: string, subtitle: string, section: PreviewSection) {
  const params = new URLSearchParams({ title, subtitle, section, v: "2" });
  return {
    url: `https://nirmalhk7.com/api/og?${params}`,
    alt: `${title} — Nirmal Khedkar`,
    width: 1200,
    height: 630,
  };
}
