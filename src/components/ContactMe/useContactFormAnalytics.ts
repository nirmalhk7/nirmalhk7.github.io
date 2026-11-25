import React from "react";
import type { useForm } from "@formspree/react";
import { trackEvent, trackFormFocus, trackFormStart, trackFormSubmit, trackGenerateLead } from "@/util/analytics";

type FormState = ReturnType<typeof useForm>[0];
type PendingTime = React.MutableRefObject<number | null>;

function finishPending(pending: PendingTime, outcome: "success" | "failure") {
  if (pending.current === null) return;
  trackEvent("form_pending", { form_id: "contact-form", interaction_type: outcome, duration_msec: Date.now() - pending.current });
  pending.current = null;
}

function useFormOutcome(state: FormState, pendingSince: PendingTime, hasTrackedSubmission: React.MutableRefObject<boolean>) {
  const lastError = React.useRef<FormState["errors"]>(null);
  React.useEffect(() => {
    if (state.succeeded && !hasTrackedSubmission.current) {
      hasTrackedSubmission.current = true;
      finishPending(pendingSince, "success");
      trackGenerateLead("contact_form", {
        form_id: "contact-form",
        form_name: "Contact form",
      });
    }
  }, [state.succeeded, hasTrackedSubmission, pendingSince]);

  React.useEffect(() => {
    const formErrors = state.errors?.getFormErrors() ?? [];
    const fieldErrors = state.errors?.getAllFieldErrors?.() ?? [];
    const errorCount = formErrors.length + fieldErrors.reduce((count, [,errors]) => count+errors.length,0);
    if (errorCount === 0 || lastError.current===state.errors) return;
    lastError.current=state.errors;
    finishPending(pendingSince, "failure");
    for (const [field,errors] of fieldErrors) {
      const fieldId = ({'NAME:':'name','contactEmail: ':'email','contactMessage: ':'message'} as Record<string,string>)[field];
      if (fieldId) trackEvent('form_validation_error',{form_id:'contact-form',field_id:fieldId,interaction_type:'server',error_count:errors.length});
    }
    trackEvent("form_error", {
      form_id: "contact-form",
      form_name: "Contact form",
      error_count: errorCount,
    });
  }, [state.errors, pendingSince]);

}

export function useContactFormAnalytics(state: FormState, submitLabel: string) {
  const hasTrackedFormStart = React.useRef(false);
  const hasTrackedSubmission = React.useRef(false);
  const hasTrackedAbandonment = React.useRef(false);

  const editedFields = React.useRef(new Set<string>());
  const pendingSince = React.useRef<number | null>(null);
  const focusedAt = React.useRef(new Map<string, number>());

  useFormOutcome(state, pendingSince, hasTrackedSubmission);

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
    focusedAt.current.set(fieldId, Date.now());
    if (!hasTrackedFormStart.current) {
      trackFormStart("contact-form", "Contact form");
      hasTrackedFormStart.current = true;
    }
    trackFormFocus(fieldId, "contact-form");
  };

  const handleFormBlur = (fieldId: string, field: HTMLInputElement | HTMLTextAreaElement) => {
    const since=focusedAt.current.get(fieldId);
    focusedAt.current.delete(fieldId);
    if (since === undefined) return;
    trackEvent('form_engagement',{action:'blur',field_id:fieldId,form_id:'contact-form',field_state:!field.value?'empty':field.validity.valid?'valid':'invalid',duration_msec:Date.now()-since});
  };

  const handleFirstEdit = (fieldId: string) => {
    if (!hasTrackedFormStart.current) { trackFormStart('contact-form','Contact form'); hasTrackedFormStart.current=true; }
    if (!editedFields.current.has(fieldId)) { editedFields.current.add(fieldId); trackEvent('form_engagement',{action:'first_edit',field_id:fieldId,form_id:'contact-form'}); }
  };

  const trackSubmit = () => {
    pendingSince.current = Date.now();
    hasTrackedAbandonment.current = false;
    hasTrackedFormStart.current = true;
    trackFormSubmit("contact-form", "Contact form", submitLabel);
  };
  return { handleFormFocus, handleFormBlur, handleFirstEdit, trackSubmit };
}
