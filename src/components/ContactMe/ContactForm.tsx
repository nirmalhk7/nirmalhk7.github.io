import { useForm, ValidationError } from "@formspree/react";
import React from "react";
import {
  trackClick,
  trackEvent,
} from "@/util/analytics";
import { useContactFormAnalytics } from "./useContactFormAnalytics";

export default function ContactForm({ submitLabel = 'Submit' }: { submitLabel?: string }) {
  const [state, handleSubmit] = useForm("mgvwblra");
  const { handleFormFocus, handleFormBlur, handleFirstEdit, trackSubmit } = useContactFormAnalytics(state, submitLabel);

  if (state.succeeded) return <p role="status">Thanks for your submission!</p>;

  return (
    <form
      data-analytics-skip-global="true"
      id="contact-form"
      name="Contact form"
      onSubmit={(event) => {
        if (state.submitting) return;
        trackSubmit();
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
        onBlur={event => handleFormBlur('name',event.currentTarget)}
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
          onBlur={event => handleFormBlur('email',event.currentTarget)}
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
          onBlur={event => handleFormBlur('message',event.currentTarget)}
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
          <a href="mailto:nirmalhk7@gmail.com" onClick={() => trackEvent('ui_action',{interaction_type:'email',source:'contact_form_fallback',form_id:'contact-form'})}>email Nirmal directly</a>.
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
