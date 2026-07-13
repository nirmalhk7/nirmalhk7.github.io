import React from "react";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get("title") || "Nirmal Khedkar";
    const subtitle =
      searchParams.get("subtitle") ||
      "Fortress Code, Lightning Fast • Software Engineer & Systems Architect";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            backgroundColor: "#0A0A0A",
            padding: "80px",
            fontFamily: "sans-serif",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle Orange Glow Circle */}
          <div
            style={{
              position: "absolute",
              top: "-150px",
              right: "-150px",
              width: "600px",
              height: "600px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(234,88,12,0.35) 0%, rgba(10,10,10,0) 70%)",
            }}
          />

          {/* Top Brand Tag */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                backgroundColor: "#EA580C",
              }}
            />
            <span
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: "#EA580C",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              NIRMAL KHEDKAR • OFFICIAL PORTFOLIO
            </span>
          </div>

          {/* Main Content Area */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              maxWidth: "1000px",
            }}
          >
            <h1
              style={{
                fontSize: 68,
                fontWeight: 900,
                color: "#FFFFFF",
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: 32,
                color: "#A1A1AA",
                lineHeight: 1.4,
                margin: 0,
              }}
            >
              {subtitle}
            </p>
          </div>

          {/* Footer Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              borderTop: "1px solid rgba(255,255,255,0.15)",
              paddingTop: "32px",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: 24,
                color: "#D4D4D8",
                fontWeight: 600,
              }}
            >
              nirmalhk7.com
            </span>
            <span
              style={{
                fontSize: 24,
                color: "#EA580C",
                fontWeight: 700,
              }}
            >
              Systems • Go • Next.js • AI
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return new Response(`Failed to generate OG image: ${message}`, {
      status: 500,
    });
  }
}
