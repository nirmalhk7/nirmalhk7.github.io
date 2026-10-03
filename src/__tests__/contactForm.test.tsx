import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ContactForm from "@/components/ContactMe/ContactForm";
import { useForm } from "@formspree/react";
import { trackEvent, trackFormStart, trackFormSubmit, trackGenerateLead } from "@/util/analytics";

jest.mock("@formspree/react", () => ({
  useForm: jest.fn(),
  ValidationError: () => null,
}));
jest.mock("@/util/analytics", () => ({
  trackClick: jest.fn(),
  trackEvent: jest.fn(),
  trackFormFocus: jest.fn(),
  trackFormStart: jest.fn(),
  trackFormSubmit: jest.fn(),
  trackGenerateLead: jest.fn(),
}));

const mockUseForm = useForm as jest.Mock;
const mockSubmit = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  mockUseForm.mockReturnValue([{ succeeded: false, submitting: false, errors: { getFormErrors: () => [] } }, mockSubmit]);
});

it("keeps one form with the existing Formspree fields and submission event", () => {
  const { container } = render(<ContactForm />);
  const form = container.querySelector("form#contact-form") as HTMLFormElement;
  expect(mockUseForm).toHaveBeenCalledWith("mgvwblra");
  expect(Array.from(form.elements).map((field) => (field as HTMLInputElement).name)).toEqual([
    "NAME:", "contactEmail: ", "contactMessage: ", "",
  ]);
  expect(screen.getByRole("textbox", { name: "Email" })).toBeRequired();
  expect(screen.getByRole("textbox", { name: "Message" })).toBeRequired();

  fireEvent.focus(screen.getByRole("textbox", { name: "Email" }));
  fireEvent.focus(screen.getByRole("textbox", { name: "Message" }));
  expect(trackFormStart).toHaveBeenCalledTimes(1);
  fireEvent.submit(form);
  expect(trackFormSubmit).toHaveBeenCalledWith("contact-form", "Contact form", "Submit");
  expect(mockSubmit).toHaveBeenCalledTimes(1);
});

it("shows the existing success message and lead event", () => {
  mockUseForm.mockReturnValue([{ succeeded: true, submitting: false, errors: { getFormErrors: () => [] } }, mockSubmit]);
  render(<ContactForm />);
  expect(screen.getByRole("status")).toHaveTextContent("Thanks for your submission!");
  expect(screen.queryByRole("button", { name: "Submit" })).not.toBeInTheDocument();
  expect(trackGenerateLead).toHaveBeenCalledWith("contact_form", {
    form_id: "contact-form",
    form_name: "Contact form",
  });
});

it("retains the form error analytics outcome", () => {
  mockUseForm.mockReturnValue([{ succeeded: false, submitting: false, errors: { getFormErrors: () => ["invalid"] } }, mockSubmit]);
  render(<ContactForm />);
  expect(trackEvent).toHaveBeenCalledWith("form_error", {
    form_id: "contact-form",
    form_name: "Contact form",
    error_count: 1,
  });
});
