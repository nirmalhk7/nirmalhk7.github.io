import React from "react";
import WebSection from "@/elements/WebSection";
import { trackClick } from "@/util/analytics";
import ContactForm from "./ContactForm";
import HiringLinks from '@/components/Site/HiringLinks';
import { m, useScroll, useTransform } from "framer-motion";

type ContactMeSectionProps = {
  variant?: "default" | "portfolio";
};

const ContactMeSection = React.forwardRef<HTMLDivElement, ContactMeSectionProps>(({ variant = "default" }, ref) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const skyY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);

  return (
    <div ref={ref}>
      <div ref={containerRef}>
        <WebSection
          id="contact"
          className={`relative overflow-hidden selection:bg-accent selection:text-white ${variant === "portfolio" ? "portfolio-contact" : "bg-[#030408]"}`}
        >
          {variant === "default" && <m.div
            className="contact-shooting-stars pointer-events-none absolute -inset-y-24 inset-x-0 z-0"
            aria-hidden="true"
            style={{ y: skyY }}
          >
            <div className="contact-twinkle-layer-mid absolute inset-0 pointer-events-none" />
            <div className="contact-twinkle-layer-bright absolute inset-0 pointer-events-none" />
            <div className="contact-stars">
              {Array.from({ length: 9 }).map((_, index) => (
                <span key={index} />
              ))}
            </div>
          </m.div>}
          <m.div
            className={`relative z-10 ${variant === "portfolio" ? "portfolio-contact-content" : ""}`}
            style={variant === "default" ? { y: contentY } : undefined}
          >
          <m.div 
            className="container mx-auto"
            initial={variant === "default" ? { opacity: 0, y: 30 } : false}
            whileInView={variant === "default" ? { opacity: 1, y: 0 } : undefined}
            viewport={variant === "default" ? { once: true, amount: 0.2 } : undefined}
            transition={variant === "default" ? { duration: 0.8, ease: "easeOut" } : undefined}
          >
            <div className="narrow m-auto text-white">
              <div className={variant === "portfolio" ? "portfolio-contact-heading" : "text-center"}>
                {variant === "portfolio" ? <><h2>LET&apos;S BUILD.</h2><p className="portfolio-contact-invitation">Hiring for backend, infrastructure, or a broader engineering role? Tell me what your team is building.</p></> : <><h3 className="my-0">Contact Me</h3><h2>Say Hi!</h2><p className="font-blocky text-3xl">I&apos;ll reach out to you as soon as I can.</p></>}
              </div>
            </div>
            <div className={`mt-24 grid gap-16 laptop:grid-cols-3 tablet:grid-cols-3 mobile-l:grid-cols-1 ${variant === "portfolio" ? "portfolio-contact-grid" : ""}`}>
              <div className="col-span-2">
                <ContactForm submitLabel={variant === 'portfolio' ? 'Send message' : 'Submit'} />
              </div>
              <div className={`w-full contact__infos ${variant === "portfolio" ? "portfolio-contact-info" : ""}`}>
                <h5 className="text-white font-blocky uppercase text-base leading-[7.2rem] tracking-[0.25rem] font-bold my-0">
                  Email
                </h5>
                <a 
                  className="" 
                  href="mailto:nirmalhk7@gmail.com"
                  data-analytics-skip-global="true"
                  onClick={() => trackClick("email", "contact_link")}
                >
                  nirmalhk7@gmail.com
                </a>
                {variant === 'portfolio' && <HiringLinks />}
              </div>
            </div>
          </m.div>
          </m.div>
        </WebSection>
      </div>
    </div>
  );
});

ContactMeSection.displayName = "ContactMeSection";
export default ContactMeSection;
