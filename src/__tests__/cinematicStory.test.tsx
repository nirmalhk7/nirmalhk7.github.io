import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import CinematicStory from "@/components/Home/CinematicStory";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string | { src: string }; alt: string }) => React.createElement("img", { src: typeof src === "string" ? src : src.src, alt }),
}));

it("renders the hero and every engineering chapter in static HTML before motion loads", () => {
  const html = renderToStaticMarkup(<CinematicStory />);
  expect(html).toContain("I BUILD &amp; SHIP BACKEND SYSTEMS.");
  expect(html).toContain(">Nirmal Khedkar</p>");
  expect(html).toContain("Backend &amp; infrastructure engineer.");
  expect(html).toContain("Visa · ZOLL Data Systems · NITK Surathkal · MS CS, CU Boulder");
  const document = new DOMParser().parseFromString(html, "text/html");
  const chapters = document.querySelectorAll("[data-story-stage]");
  expect(chapters).toHaveLength(4);
  for (const chapter of chapters) {
    expect(chapter.querySelector("h3")?.textContent).toBeTruthy();
    expect(chapter.querySelector("p")?.textContent).toBeTruthy();
  }
  expect(html).not.toContain('data-cinematic="ready"');
  expect(html).not.toContain('style="opacity:0');
});
