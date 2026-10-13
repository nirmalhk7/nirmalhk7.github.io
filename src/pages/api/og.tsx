import React from "react";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import beachPhoto from "@/assets/images/BeachNK_1.jpg";

export const config = { runtime: "edge" };

const sections: Record<string, { label: string; path: string; dark: boolean }> = {
  home: { label: "Engineering", path: "", dark: true },
  projects: { label: "Projects", path: "/projects", dark: false },
  writing: { label: "The Blue Green Manual", path: "/blog", dark: true },
  resume: { label: "Résumé", path: "/resume", dark: false },
  article: { label: "The Blue Green Manual", path: "/blog", dark: false },
};

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = (searchParams.get("title")?.trim() || "Built for the real world.").slice(0, 160);
    const subtitle = (searchParams.get("subtitle")?.trim() || "Product thinking. Engineering depth.").slice(0, 180);
    const section = sections[searchParams.get("section") || "home"] || sections.home;
    const paper = "#f5f2eb";
    const night = "#19211f";
    const foreground = section.dark ? paper : night;
    const titleSize = title.length > 100 ? 38 : title.length > 75 ? 52 : title.length > 42 ? 64 : section === sections.article ? 68 : 88;
    const portraitWidth = Math.round(630 * beachPhoto.width / beachPhoto.height);
    const font = await fetch(new URL("/fonts/outfit-latin-600.ttf", req.url));
    if (!font.ok) throw new Error("Preview font could not load");

    return new ImageResponse(
      <div style={{ width: "100%", height: "100%", display: "flex", background: section.dark ? night : paper, color: foreground, fontFamily: "Outfit", position: "relative" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 800, padding: "64px 60px 48px" }}>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flexGrow: 1, paddingBottom: 32 }}>
            <h1 style={{ fontSize: titleSize, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.04, margin: "0 0 28px" }}>{title}</h1>
            <p style={{ fontSize: 24, lineHeight: 1.35, color: section.dark ? "#b8bcb6" : "#565c58", margin: 0 }}>{subtitle}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontSize: 28 }}>Nirmal Khedkar</span>
            <span style={{ fontSize: 20, color: section.dark ? "#b8bcb6" : "#565c58" }}>nirmalhk7.com{section.path}</span>
          </div>
        </div>
        <div style={{ display: "flex", width: 400, height: "100%", position: "relative", overflow: "hidden", background: night }}>
          {/* The homepage portrait, composed for a share card. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" src={new URL(beachPhoto.src, req.url).href} width={portraitWidth} height={630} style={{ position: "absolute", top: 0, right: 0, maxWidth: portraitWidth }} />
          <div style={{ position: "absolute", display: "flex", bottom: 0, left: 0, width: "100%", padding: "24px 28px", color: paper, background: "#c43b31", fontSize: 24 }}>{section.label}</div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        fonts: [{ name: "Outfit", data: await font.arrayBuffer(), weight: 600, style: "normal" }],
        headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800" },
      }
    );
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return new Response(`Failed to generate OG image: ${message}`, { status: 500 });
  }
}
