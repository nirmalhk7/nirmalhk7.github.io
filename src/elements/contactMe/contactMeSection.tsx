import React from "react";

interface ContactMeSectionStateInterface {
  name: string,
  email: string,
  subject: string,
  message: string
}

class ContactMeSection extends React.Component<object, ContactMeSectionStateInterface> {
  constructor(props: object) {
    super(props);
    this.state = {
      name: "",
      email: "",
      subject: "",
      message: ""
    };
    this.onChange = this.onChange.bind(this);
  }
  onChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const target = event.target;
    this.setState({ [target.id]: target.value } as Pick<ContactMeSectionStateInterface, keyof ContactMeSectionStateInterface>);
  }

  render() {
    return (
      <div>
        <section
          className="relative bg-fixed bg-center bg-no-repeat bg-black selection:bg-accent selection:text-white"
        >
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
                <form method="post">
                  <input
                    className="w-full bg-transparent mb-4"
                    id="name"
                    name="NAME:"
                    onChange={this.onChange}
                    placeholder="Name"
                    type="text"
                  />
                  <div className="form-field">
                    <input
                      aria-required="true"
                      className="w-full"
                      id="email"
                      name="contactEmail: "
                      onChange={this.onChange}
                      placeholder="Email"
                      required
                      type="email"
                    />
                  </div>
                
                  <div className="form-field">
                    <textarea
                      aria-required="true"
                      className="w-full"
                      cols={40}
                      id="message"
                      name="contactMessage: "
                      onChange={()=> this.onChange}
                      placeholder="Message"
                      required
                      rows={10}
                    />
                  </div>
                  <input
                    className="mt-32 font-blocky uppercase text-center  text-button font-bold bg-accent border-4 border-accent text-white hover:text-black  no-underline w-full"
                    type="submit"
                    value="Submit"
                    style={{lineHeight:"0"}}
                  />
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
        </section>
      </div>
    );
  }
}
export default ContactMeSection;
