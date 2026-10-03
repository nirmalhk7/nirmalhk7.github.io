import { useForm, ValidationError } from "@formspree/react";
import React from "react";
import {
  trackClick,
  trackEvent,
  trackFormFocus,
  trackFormStart,
  trackFormSubmit,
  trackGenerateLead,
} from "@/util/analytics";

export default function ContactForm() {
  const [state, handleSubmit] = useForm("mgvwblra");
  const hasTrackedFormStart = React.useRef(false);
  const hasTrackedSubmission = React.useRef(false);
  const hasTrackedAbandonment = React.useRef(false);

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
    if (formErrors.length === 0) return;
    trackEvent("form_error", {
      form_id: "contact-form",
      form_name: "Contact form",
      error_count: formErrors.length,
    });
  }, [state.errors]);

  React.useEffect(() => {
    const handlePageHide = () => {
      if (hasTrackedFormStart.current && !hasTrackedSubmission.current && !hasTrackedAbandonment.current) {
        hasTrackedAbandonment.current = true;
        trackEvent("form_abandonment", {
          form_id: "contact-form",
          form_name: "Contact form",
        });
      }
    };
    window.addEventListener("pagehide", handlePageHide);
    return () => window.removeEventListener("pagehide", handlePageHide);
  }, []);

  const handleFormFocus = (fieldId: string) => {
    if (!hasTrackedFormStart.current) {
      trackFormStart("contact-form", "Contact form");
      hasTrackedFormStart.current = true;
    }
    trackFormFocus(fieldId, "contact-form");
  };

  if (state.succeeded) return <p role="status">Thanks for your submission!</p>;

  return (
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
        aria-label="Name"
        onFocus={() => handleFormFocus("name")}
        onInvalid={() => trackEvent("form_validation_error", {
          form_id: "contact-form",
          form_name: "Contact form",
          field_id: "name",
        })}
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
          aria-label="Email"
          onFocus={() => handleFormFocus("email")}
          onInvalid={() => trackEvent("form_validation_error", {
            form_id: "contact-form",
            form_name: "Contact form",
            field_id: "email",
          })}
        />
        <ValidationError prefix="Email" field="email" errors={state.errors} />
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
          aria-label="Message"
          onFocus={() => handleFormFocus("message")}
          onInvalid={() => trackEvent("form_validation_error", {
            form_id: "contact-form",
            form_name: "Contact form",
            field_id: "message",
          })}
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
  );
}
