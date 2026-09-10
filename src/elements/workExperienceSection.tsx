import React, { useRef, useEffect } from "react";
import WebSection from "@/elements/WebSection";
import { m, AnimatePresence } from "framer-motion";
import { createRafThrottled } from "@/util/rafThrottle";

type WorkExperienceType = {
  timeframe: string;
  company: string;
  post: string;
  description: string | string[];
};

const WorkExperienceSection = React.forwardRef<
  HTMLElement,
  {
    experience: WorkExperienceType[];
  }
>(({ experience }, ref) => {
  // Order chronologically from earliest to latest so the last role is at the end
  const chronologicalExperience = React.useMemo(
    () => [...experience].reverse(),
    [experience]
  );

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPercent, setScrollPercent] = React.useState(100);
  const [activeIndex, setActiveIndex] = React.useState(chronologicalExperience.length - 1);

  const handleScroll = React.useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (maxScroll <= 0) {
      setScrollPercent(100);
      setActiveIndex(chronologicalExperience.length - 1);
      return;
    }
    const pct = (container.scrollLeft / maxScroll) * 100;
    setScrollPercent(pct);

    const children = Array.from(container.children) as HTMLElement[];
    let minDistance = Infinity;
    let closestIndex = chronologicalExperience.length - 1;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;

    children.forEach((child, idx) => {
      const childCenter = child.offsetLeft + child.clientWidth / 2;
      const distance = Math.abs(containerCenter - childCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });
    setActiveIndex(closestIndex);
  }, [chronologicalExperience.length]);
  const scheduledScroll = React.useMemo(
    () => createRafThrottled(handleScroll),
    [handleScroll]
  );

  // By default, ensure it is scrolled completely to the right
  useEffect(() => {
    const scrollToRightEnd = () => {
      const container = scrollContainerRef.current;
      if (container) {
        container.scrollLeft = container.scrollWidth;
        handleScroll();
      }
    };

    scrollToRightEnd();
    const timer1 = setTimeout(scrollToRightEnd, 100);
    const timer2 = setTimeout(scrollToRightEnd, 350);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [chronologicalExperience.length, handleScroll]);

  // Sync scroll percent on resize
  useEffect(() => {
    window.addEventListener("resize", scheduledScroll);
    return () => {
      window.removeEventListener("resize", scheduledScroll);
      scheduledScroll.cancel();
    };
  }, [scheduledScroll]);

  const scrollByAmount = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 450;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const scrollToCard = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const children = Array.from(container.children) as HTMLElement[];
    const targetCard = children[index];
    if (targetCard) {
      const targetScrollLeft = targetCard.offsetLeft - container.offsetLeft;
      container.scrollTo({
        left: targetScrollLeft - 32, // Offset for gap padding
        behavior: "smooth",
      });
    }
  };

  /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
  return (
    <WebSection
      ref={ref}
      className="pt-32 pb-32 bg-white relative selection:bg-accent selection:text-white overflow-hidden"
      id="workexperience"
      deferRender
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h3>
            My Work Experience
          </h3>

          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => scrollByAmount("left")}
              className="!border-0 !leading-normal !tracking-normal !normal-case !font-sans w-12 h-12 rounded-full bg-gray-100 hover:bg-accent hover:text-white text-gray-700 flex items-center justify-center transition-all text-xl"
              aria-label="Scroll left"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount("right")}
              className="!border-0 !leading-normal !tracking-normal !normal-case !font-sans w-12 h-12 rounded-full bg-gray-100 hover:bg-accent hover:text-white text-gray-700 flex items-center justify-center transition-all text-xl"
              aria-label="Scroll right"
            >
              →
            </button>

          </div>
        </div>

        {/* Timeline Progress Tracker */}
        <div className="w-full mb-12 px-6 md:px-12 select-none relative z-10">
          <div className="w-full relative py-4">
            {/* Gray Background Timeline Bar */}
            <div className="absolute top-1/2 left-0 right-0 h-[3px] bg-gray-100 -translate-y-1/2 z-0 rounded-full" />

            {/* Active Accent Timeline Progress Fill */}
            <div
              className="absolute top-1/2 left-0 h-[3px] bg-accent -translate-y-1/2 z-0 transition-all duration-150 rounded-full"
              style={{ width: `${scrollPercent}%` }}
            />

            {/* Milestones / Nodes */}
            <div className="relative flex justify-between items-center z-10 w-full">
              {chronologicalExperience.map((element, index) => {
                const isActive = index === activeIndex;
                const isPast = index <= activeIndex;

                return (
                  <button
                    key={`${element.company}-node-${index}`}
                    type="button"
                    onClick={() => scrollToCard(index)}
                    className="flex flex-col items-center justify-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
                    aria-label={`Go to ${element.company} experience`}
                  >
                    <div className="relative flex items-center justify-center w-8 h-8">
                      {/* Active spring-animated ring indicator */}
                      <AnimatePresence>
                        {isActive && (
                          <m.div
                            layoutId="activeTimelineIndicator"
                            className="absolute w-8 h-8 rounded-full border-2 border-accent"
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                          />
                        )}
                      </AnimatePresence>

                      {/* Node circle dot */}
                      <div
                        className={`w-5 h-5 rounded-full border-2 transition-all duration-300 z-10 ${
                          isActive
                            ? "bg-white border-accent scale-110"
                            : isPast
                            ? "bg-accent border-accent"
                            : "bg-white border-gray-300 group-hover:border-gray-500"
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Horizontal Scrolling Track */}
        <div
          ref={scrollContainerRef}
          onScroll={scheduledScroll}
          className="w-full flex flex-row overflow-x-auto snap-x snap-mandatory gap-8 pb-8 pt-2 no-scrollbar scroll-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-2xl"
          tabIndex={0}
          role="region"
          aria-label="Work experience timeline (use arrow keys to scroll)"
        >
          {chronologicalExperience.map((element, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={`${element.company}-${index}`}
                className="snap-start shrink-0 w-[80%] md:w-[40%] lg:w-[28%]"
              >
                <div
                  className={`border rounded-2xl p-8 md:p-10 bg-white flex flex-col justify-between h-full transition-all duration-300 ${
                    isActive ? "border-accent shadow-lg" : "border-gray-300"
                  }`}
                >
                  <div>
                    <p
                      className={`text-xl font-bold uppercase tracking-wider mb-3 transition-colors duration-300 ${
                        isActive ? "text-accent" : "text-accent/60"
                      }`}
                    >
                      {element.timeframe}
                    </p>

                    <h4 className="text-4xl md:text-5xl font-extrabold mb-2">
                      {element.company}
                    </h4>

                    <h5 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6 pb-4 border-b border-gray-200">
                      {element.post}
                    </h5>

                    <div className="text-2xl leading-relaxed text-gray-800">
                      {typeof element.description === "string" ? (
                        <p>{element.description}</p>
                      ) : (
                        <ul className="space-y-4">
                          {element.description.map((line) => (
                            <li
                              key={line}
                              className="flex items-start space-x-3"
                            >
                              <span className="text-accent font-bold mt-1 shrink-0">
                                •
                              </span>
                              <span>{line}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </WebSection>
  );
  /* eslint-enable jsx-a11y/no-noninteractive-tabindex */
});

WorkExperienceSection.displayName = "WorkExperienceSection";

export default WorkExperienceSection;
