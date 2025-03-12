import { useForm, ValidationError } from "@formspree/react";
import React from "react";
import WebSection from "@/elements/WebSection";

interface ContactMeSectionStateInterface {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactMeSection() {
  const [state, handleSubmit] = useForm("mgvwblra");

  if (state.succeeded) {
    return <p>Thanks for your submission!</p>;
  }

  return (
    <div>
      <WebSection id="contact" className="relative bg-fixed bg-center bg-no-repeat bg-black selection:bg-accent selection:text-white">
        <div className="z-10 narrow m-auto text-white">
          <div className=" text-center">
            <h3 className="text-accent font-blocky font-semibold uppercase my-0">
              Contact Me
            </h3>
            <h1>Say Hi!</h1>
            <p className="font-blocky">
              I&apos;ll reach out to you as soon as I can.
            </p>
          </div>
        </div>
        <div className="container mx-auto z-10">
          <div className="mt-24 grid gap-16 laptop:grid-cols-3 tablet:grid-cols-3 mobile-l:grid-cols-1">
            <div className="col-span-2">
              <form onSubmit={handleSubmit}>
                <input
                  className="w-full bg-transparent mb-4"
                  id="name"
                  name="NAME:"
                  placeholder="Name"
                  type="text"
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
                  />
                </div>
                <button
                  className="mt-32 py-8 button button-red w-full bg-accent text-white hover:text-accent hover:bg-white"
                  type="submit"
                  style={{ lineHeight: "0" }}
                  disabled={state.submitting}
                >
                  Submit
                </button>
              </form>
            </div>
            <div className="w-full contact__infos">
              <h4 className="text-white font-blocky uppercase text-navbar font-bold my-0">
                Email
              </h4>
              <a className="" href="mailto:nirmalhk7@gmail.com">
                nirmalhk7@gmail.com
              </a>
            </div>
          </div>
        </div>
      </WebSection>
    </div>
  );
}
