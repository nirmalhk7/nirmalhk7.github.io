import { useForm, ValidationError } from "@formspree/react";
import React from "react";
import WebSection from "@/elements/WebSection";
import { trackClick, trackEvent, trackFormFocus, trackFormStart, trackFormSubmit, trackGenerateLead } from "@/util/analytics";
import { motion, useScroll, useTransform } from "framer-motion";

const ContactMeSection = React.forwardRef<HTMLDivElement, Record<string, unknown>>((_props, ref) => {
  const [state, handleSubmit] = useForm("mgvwblra");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const hasTrackedFormStart = React.useRef(false);
  const hasTrackedSubmission = React.useRef(false);
  const hasTrackedAbandonment = React.useRef(false);
  
  // Combine refs if needed, but here we can just use the internal one for scroll target
  // and pass the external ref to the outermost div
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const skyY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);

  React.useEffect(() => {
    if (state.succeeded) {
      hasTrackedSubmission.current = true;
      trackGenerateLead("contact_form", {
        form_id: "contact-form",
        form_name: "Contact form",
      });
      trackClick("success", "contact_form_submission");
    }
  }, [state.succeeded]);

  React.useEffect(() => {
    const formErrors = state.errors?.getFormErrors() ?? [];
    if (formErrors.length === 0) {
      return;
    }

    trackEvent("form_error", {
      form_id: "contact-form",
      form_name: "Contact form",
      error_count: formErrors.length,
    });
  }, [state.errors]);

  React.useEffect(() => {
    const handlePageHide = () => {
      if (
        hasTrackedFormStart.current &&
        !hasTrackedSubmission.current &&
        !hasTrackedAbandonment.current
      ) {
        hasTrackedAbandonment.current = true;
        trackEvent("form_abandonment", {
          form_id: "contact-form",
          form_name: "Contact form",
        });
      }
    };

    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, []);

  const handleFormFocus = (fieldId: string) => {
    if (!hasTrackedFormStart.current) {
      trackFormStart("contact-form", "Contact form");
      hasTrackedFormStart.current = true;
    }

    trackFormFocus(fieldId, "contact-form");
  };

  if (state.succeeded) {
    return <p>Thanks for your submission!</p>;
  }

  return (
    <div ref={ref}>
      <div ref={containerRef}>
        <WebSection
          id="contact"
          className="relative overflow-hidden bg-black selection:bg-accent selection:text-white"
        >
          <motion.div
            className="contact-shooting-stars pointer-events-none absolute -inset-y-24 inset-x-0 z-0"
            aria-hidden="true"
            style={{ y: skyY }}
          >
            <div className="contact-stars">
              {Array.from({ length: 9 }).map((_, index) => (
                <span key={index} />
              ))}
            </div>
          </motion.div>
          <motion.div
            className="relative z-10"
            style={{ y: contentY }}
          >
          <motion.div 
            className="container mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="narrow m-auto text-white">
              <div className=" text-center">
                <h3 className="my-0">
                  Contact Me
                </h3>
                <h1>Say Hi!</h1>
                <p className="font-blocky text-3xl">
                  I&apos;ll reach out to you as soon as I can.
                </p>
              </div>
            </div>
            <div className="mt-24 grid gap-16 laptop:grid-cols-3 tablet:grid-cols-3 mobile-l:grid-cols-1">
              <div className="col-span-2">
                <form
                  id="contact-form"
                  name="Contact form"
                  onSubmit={(event) => {
                    trackFormSubmit("contact-form", "Contact form", "Submit");
                    handleSubmit(event);
                  }}
                >
                  <input
                    className="w-full bg-transparent mb-4"
                    id="name"
                    name="NAME:"
                    placeholder="Name"
                    type="text"
                    onFocus={() => handleFormFocus("name")}
                    onInvalid={() => {
                      trackEvent("form_validation_error", {
                        form_id: "contact-form",
                        form_name: "Contact form",
                        field_id: "name",
                      });
                    }}
                  />

                  <div className="form-field">
                    <input
                      aria-required="true"
                      className="w-full"
                      id="email"
                      name="contactEmail: "
                      placeholder="Email"
                      required
                      type="email"
                      onFocus={() => handleFormFocus("email")}
                      onInvalid={() => {
                        trackEvent("form_validation_error", {
                          form_id: "contact-form",
                          form_name: "Contact form",
                          field_id: "email",
                        });
                      }}
                    />
                    <ValidationError
                      prefix="Email"
                      field="email"
                      errors={state.errors}
                    />
                  </div>

                  <div className="form-field">
                    <textarea
                      aria-required="true"
                      className="w-full"
                      cols={40}
                      id="message"
                      name="contactMessage: "
                      placeholder="Message"
                      required
                      rows={10}
                      onFocus={() => handleFormFocus("message")}
                      onInvalid={() => {
                        trackEvent("form_validation_error", {
                          form_id: "contact-form",
                          form_name: "Contact form",
                          field_id: "message",
                        });
                      }}
                    />
                  </div>
                  <button
                    className="button button-accent-fill w-full mt-32"
                    type="submit"
                    disabled={state.submitting}
                    data-analytics-skip-global="true"
                    onClick={() => trackClick("submit", "contact_form")}
                  >
                    Submit
                  </button>
                </form>
              </div>
              <div className="w-full contact__infos">
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
              </div>
            </div>
          </motion.div>
          </motion.div>
        </WebSection>
      </div>
    </div>
  );
});

ContactMeSection.displayName = "ContactMeSection";
export default ContactMeSection;
