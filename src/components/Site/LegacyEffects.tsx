import React from 'react';
import dynamic from 'next/dynamic';
import { m, useScroll, useSpring } from 'framer-motion';
import { useViewTransitions } from '@/hooks/useViewTransitions';

const ScrollToTop = dynamic(() => import('@/elements/scrollToTop'), { ssr: false });
const CursorSpotlight = dynamic(() => import('@/components/UI/CursorSpotlight'), { ssr: false });
const SmoothScroller = dynamic(() => import('@/components/UI/SmoothScroller'), { ssr: false });
const SectionNavigator = dynamic(() => import('@/components/UI/SectionNavigator'), { ssr: false });

export default function LegacyEffects() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  useViewTransitions();
  return <>
    <m.div className="native-scroll-progress fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-white to-accent z-[60] origin-left" style={{ scaleX }} />
    <ScrollToTop />
    <SmoothScroller />
    <SectionNavigator />
    <CursorSpotlight />
  </>;
}
