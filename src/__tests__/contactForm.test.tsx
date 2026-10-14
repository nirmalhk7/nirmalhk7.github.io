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
  expect(screen.getByRole('alert')).toHaveTextContent('Your message could not be sent');
  expect(screen.getByRole('link', { name: 'email Nirmal directly' })).toHaveAttribute('href', 'mailto:nirmalhk7@gmail.com');
  expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled();
  expect(trackEvent).toHaveBeenCalledWith("form_error", {
    form_id: "contact-form",
    form_name: "Contact form",
    error_count: 1,
  });
});

it('names the action and announces sending while preventing duplicate submission', () => {
  mockUseForm.mockReturnValue([{ succeeded: false, submitting: true, errors: { getFormErrors: () => [] } }, mockSubmit]);
  render(<ContactForm submitLabel="Send message" />);
  expect(screen.getByRole('button', { name: 'Sending…' })).toBeDisabled();
  expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute('autocomplete', 'email');
});

it('records first edit without values and deduplicates success across Strict Mode effect replay', () => {
  const { rerender }=render(<React.StrictMode><ContactForm /></React.StrictMode>);
  fireEvent.change(screen.getByRole('textbox', {name:'Email'}), {target:{value:'private@example.com'}});
  fireEvent.change(screen.getByRole('textbox', {name:'Email'}), {target:{value:'other@example.com'}});
  expect(trackEvent).toHaveBeenCalledWith('form_engagement', {action:'first_edit', field_id:'email', form_id:'contact-form'});
  expect((trackEvent as jest.Mock).mock.calls.filter(call=>call[1].action==='first_edit')).toHaveLength(1);
  mockUseForm.mockReturnValue([{succeeded:true, submitting:false, errors:{getFormErrors:()=>[]}},mockSubmit]);
  rerender(<React.StrictMode><ContactForm /></React.StrictMode>);
  expect(trackGenerateLead).toHaveBeenCalledTimes(1);
});

it('does not abandon after success and includes pending duration on failure', () => {
  const {container,rerender}=render(<ContactForm />);
  fireEvent.change(screen.getByRole('textbox', {name:'Message'}), {target:{value:'private'}});
  const form=container.querySelector('form'); if (!form) throw new Error('Missing form');
  fireEvent.submit(form);
  mockUseForm.mockReturnValue([{succeeded:false, submitting:false, errors:{getFormErrors:()=>['failed']}},mockSubmit]);
  rerender(<ContactForm />);
  expect(trackEvent).toHaveBeenCalledWith('form_pending', expect.objectContaining({interaction_type:'failure',duration_msec:expect.any(Number)}));
  mockUseForm.mockReturnValue([{succeeded:true, submitting:false, errors:{getFormErrors:()=>[]}},mockSubmit]);
  rerender(<ContactForm />);
  fireEvent(window,new Event('pagehide'));
  expect((trackEvent as jest.Mock).mock.calls.filter(call=>call[0]==='form_abandonment')).toHaveLength(0);
});

it('records server field errors and pending failure without copying error text',()=>{
  const {container,rerender}=render(<ContactForm />);const form=container.querySelector('form');if (!form) throw new Error('Missing form');
  fireEvent.submit(form);
  mockUseForm.mockReturnValue([{succeeded:false,submitting:false,errors:{getFormErrors:()=>[],getAllFieldErrors:()=>[['contactEmail: ',[{code:'TYPE_EMAIL',message:'private@example.com'}]]]}},mockSubmit]);
  rerender(<ContactForm />);
  expect(trackEvent).toHaveBeenCalledWith('form_pending',expect.objectContaining({interaction_type:'failure'}));
  expect(trackEvent).toHaveBeenCalledWith('form_validation_error',expect.objectContaining({field_id:'email',interaction_type:'server'}));
  expect(JSON.stringify((trackEvent as jest.Mock).mock.calls)).not.toContain('private@example.com');
});

it('abandons an edited form once across repeated pagehide and unmount',()=>{
  const {unmount}=render(<ContactForm />);
  fireEvent.change(screen.getByRole('textbox',{name:'Message'}),{target:{value:'Private'}});
  fireEvent(window,new Event('pagehide'));fireEvent(window,new Event('pagehide'));unmount();
  expect((trackEvent as jest.Mock).mock.calls.filter(call=>call[0]==='form_abandonment')).toHaveLength(1);
});

it('deduplicates a server failure during Strict Mode effect replay',()=>{
  mockUseForm.mockReturnValue([{succeeded:false,submitting:false,errors:{getFormErrors:()=>['failed']}},mockSubmit]);
  render(<React.StrictMode><ContactForm /></React.StrictMode>);
  expect((trackEvent as jest.Mock).mock.calls.filter(call=>call[0]==='form_error')).toHaveLength(1);
});
