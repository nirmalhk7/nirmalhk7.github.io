import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import React, { useMemo, useState } from "react";
import { PortfolioNavigation } from "./PortfolioNavigation";
import { useNavigationMenuEvent } from "./navigationInteraction";
import { useLegacyNavbarScroll, useNavbarSections } from "./useNavbarSections";

const LegacyNavigation = dynamic(() => import("./LegacyNavigation").then(module => module.LegacyNavigation));

export interface NavbarItem {
  label: string;
  route: string;
  sectionId: string;
}

const items = [
  { label: "Home", home: "/", elsewhere: "/", sectionId: "max-jumbo" },
  { label: "About", home: "#about", elsewhere: "/#about", sectionId: "about" },
  { label: "Projects", home: "#project", elsewhere: "/projects", sectionId: "project" },
  { label: "Blog", home: "#blog", elsewhere: "/blog", sectionId: "blog" },
  { label: "Contact", home: "#contact", elsewhere: "/#contact", sectionId: "contact" },
];
const sectionIds = items.map(item => item.sectionId);

export default function Navbar({ variant = "default" }: { variant?: "default" | "portfolio" }) {
  const { pathname } = useRouter();
  const [mobileMenuClick, mobileMenuSet] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const portfolio = variant === "portfolio";
  const activeSectionId = useNavbarSections(pathname, portfolio, sectionIds);
  const isScrolled = useLegacyNavbarScroll(portfolio, pathname);
  useNavigationMenuEvent(mobileMenuClick, "legacy");
  const navigationItems = useMemo(() => items.map(item => ({
    label: item.label, route: pathname === "/" ? item.home : item.elsewhere, sectionId: item.sectionId,
  })), [pathname]);
  if (portfolio) return <PortfolioNavigation items={navigationItems} activeSectionId={activeSectionId} />;
  return (
    <LegacyNavigation
      navbarInternalData={navigationItems}
      activeSectionId={activeSectionId}
      pathname={pathname}
      mobileMenuClick={mobileMenuClick}
      mobileMenuSet={mobileMenuSet}
      isScrolled={isScrolled}
      hoveredIndex={hoveredIndex}
      setHoveredIndex={setHoveredIndex}
    />
  );
}
