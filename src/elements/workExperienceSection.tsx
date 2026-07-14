import React, { useRef, useEffect } from "react";
import WebSection from "@/elements/WebSection";

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

  // By default, ensure it is scrolled completely to the right
  useEffect(() => {
    const scrollToRightEnd = () => {
      const container = scrollContainerRef.current;
      if (container) {
        container.scrollLeft = container.scrollWidth;
      }
    };

    scrollToRightEnd();
    const timer1 = setTimeout(scrollToRightEnd, 100);
    const timer2 = setTimeout(scrollToRightEnd, 350);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [chronologicalExperience.length]);

  const scrollByAmount = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 450;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
  return (
    <WebSection
      ref={ref}
      className="pt-32 pb-32 bg-white relative selection:bg-accent selection:text-white overflow-hidden"
      id="workexperience"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-16">
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

        {/* Horizontal Scrolling Track */}
        <div
          ref={scrollContainerRef}
          className="w-full flex flex-row overflow-x-auto snap-x snap-mandatory gap-8 pb-8 pt-2 no-scrollbar scroll-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-2xl"
          tabIndex={0}
          role="region"
          aria-label="Work experience timeline (use arrow keys to scroll)"
        >
          {chronologicalExperience.map((element, index) => (
            <div
              key={`${element.company}-${index}`}
              className="snap-start shrink-0 w-[80%] md:w-[40%] lg:w-[28%]"
            >
              <div className="border border-gray-300 rounded-2xl p-8 md:p-10 bg-white flex flex-col justify-between h-full">
                <div>
                  <p className="text-xl font-bold text-accent uppercase tracking-wider mb-3">
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
          ))}
        </div>
      </div>
    </WebSection>
  );
  /* eslint-enable jsx-a11y/no-noninteractive-tabindex */
});

WorkExperienceSection.displayName = "WorkExperienceSection";

export default WorkExperienceSection;
