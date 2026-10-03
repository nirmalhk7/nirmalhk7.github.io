import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import CinematicStory from "@/components/Home/CinematicStory";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string | { src: string }; alt: string }) => React.createElement("img", { src: typeof src === "string" ? src : src.src, alt }),
}));

it("renders the hero and all engineering evidence in static HTML before motion loads", () => {
  const html = renderToStaticMarkup(<CinematicStory />);
  expect(html).toContain("NIRMAL.");
  expect(html).toContain("backend and infrastructure engineer");
  expect(html).toContain("Visa · ZOLL Data Systems · MS CS, CU Boulder");
  for (const heading of ["Interface", "Services", "Delivery", "Infrastructure"]) {
    expect(html).toContain(`>${heading}</h3>`);
  }
  expect(html).not.toContain('data-cinematic="ready"');
  expect(html).not.toContain('style="opacity:0');
});
