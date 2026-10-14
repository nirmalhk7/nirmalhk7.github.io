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

export default function ContactForm({ submitLabel = 'Submit' }: { submitLabel?: string }) {
  const [state, handleSubmit] = useForm("mgvwblra");
  const hasTrackedFormStart = React.useRef(false);
  const hasTrackedSubmission = React.useRef(false);
  const hasTrackedAbandonment = React.useRef(false);

  const editedFields = React.useRef(new Set<string>());
  const pendingSince = React.useRef<number | null>(null);
  const lastError = React.useRef<typeof state.errors>(null);

  React.useEffect(() => {
    if (state.succeeded && !hasTrackedSubmission.current) {
      hasTrackedSubmission.current = true;
      if (pendingSince.current !== null) { trackEvent("form_pending",{form_id:"contact-form",interaction_type:"success",duration_msec:Date.now()-pendingSince.current}); pendingSince.current=null; }
      trackGenerateLead("contact_form", {
        form_id: "contact-form",
        form_name: "Contact form",
      });
    }
  }, [state.succeeded]);

  React.useEffect(() => {
    const formErrors = state.errors?.getFormErrors() ?? [];
    const fieldErrors = state.errors?.getAllFieldErrors?.() ?? [];
    const errorCount = formErrors.length + fieldErrors.reduce((count, [,errors]) => count+errors.length,0);
    if (errorCount === 0 || lastError.current===state.errors) return;
    lastError.current=state.errors;
    if (pendingSince.current !== null) { trackEvent("form_pending",{form_id:"contact-form",interaction_type:"failure",duration_msec:Date.now()-pendingSince.current}); pendingSince.current=null; }
    for (const [field,errors] of fieldErrors) {
      const fieldId = ({'NAME:':'name','contactEmail: ':'email','contactMessage: ':'message'} as Record<string,string>)[field];
      if (fieldId) trackEvent('form_validation_error',{form_id:'contact-form',field_id:fieldId,interaction_type:'server',error_count:errors.length});
    }
    trackEvent("form_error", {
      form_id: "contact-form",
      form_name: "Contact form",
      error_count: errorCount,
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
    return () => { handlePageHide(); window.removeEventListener("pagehide", handlePageHide); };
  }, []);

  const handleFormFocus = (fieldId: string) => {
    if (!hasTrackedFormStart.current) {
      trackFormStart("contact-form", "Contact form");
      hasTrackedFormStart.current = true;
    }
    trackFormFocus(fieldId, "contact-form");
  };

  const handleFirstEdit = (fieldId: string) => {
    if (!hasTrackedFormStart.current) { trackFormStart('contact-form','Contact form'); hasTrackedFormStart.current=true; }
    if (!editedFields.current.has(fieldId)) { editedFields.current.add(fieldId); trackEvent('form_engagement',{action:'first_edit',field_id:fieldId,form_id:'contact-form'}); }
  };

  if (state.succeeded) return <p role="status">Thanks for your submission!</p>;

  return (
    <form
      data-analytics-skip-global="true"
      id="contact-form"
      name="Contact form"
      onSubmit={(event) => {
        if (state.submitting) return;
        pendingSince.current=Date.now();
        hasTrackedAbandonment.current=false;
        hasTrackedFormStart.current=true;
        trackFormSubmit("contact-form", "Contact form", submitLabel);
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
        autoComplete="name"
        onChange={() => handleFirstEdit("name")}
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
          autoComplete="email"
          onChange={() => handleFirstEdit("email")}
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
          onChange={() => handleFirstEdit("message")}
        onFocus={() => handleFormFocus("message")}
          onInvalid={() => trackEvent("form_validation_error", {
            form_id: "contact-form",
            form_name: "Contact form",
            field_id: "message",
          })}
        />
      </div>

      {!!state.errors?.getFormErrors().length && (
        <p role="alert">
          Your message could not be sent. Please try again, or{' '}
          <a href="mailto:nirmalhk7@gmail.com">email Nirmal directly</a>.
        </p>
      )}

      <button data-analytics-id="contactform_control_2"
        className="button button-accent-fill w-full mt-32"
        type="submit"
        disabled={state.submitting}
        data-analytics-skip-global="true"
        onClick={() => trackClick("submit", "contact_form")}
      >
        {state.submitting ? 'Sending…' : submitLabel}
      </button>
    </form>
  );
}
