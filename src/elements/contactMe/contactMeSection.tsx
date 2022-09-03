import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
const styles = {};

class ContactMeSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      email: null,
      subject: null,
      message: null,
      response: null,
    };
    this.onChange = this.onChange.bind(this);
  }
  onChange(event) {
    event.preventDefault();
    this.setState({ [event.target.id]: event.target.value });
  }

  render() {
    return (
      <div>
        <section
          className={`relative ${styles.section_contact} bg-fixed bg-center bg-no-repeat`}
          id="contact"
        >
          {/* <div className="z-0 bg-black h-full left-0 opacity-75 absolute top-0 w-full " /> */}
          <div className="z-10 narrow m-auto">
            <div className=" text-center">
              <h3 className="text-accent font-blocky  not-italic leading-tight font-semibold uppercase">
                Contact Me
              </h3>
              <h1>Say Hi!</h1>
              <p className="font-blocky">
                I'll reach out to you as soon as I can.
              </p>
            </div>
          </div>
          <div
            className="container mx-auto z-10"
            style={{ maxWidth: "1000px" }}
          >
            <div className="grid laptop:grid-cols-3 tablet:grid-cols-3 mobile-l:grid-cols-1">
              <div className={`col-span-2`}>
                <form method="post">
                  <input
                    className="bg-transparent border border-solid text-white mb-4"
                    id="name"
                    name="NAME:"
                    onChange={this.onChange}
                    placeholder="Name"
                    type="text"
                  />
                  <div className="form-field">
                    <input
                      aria-required="true"
                      className="w-full "
                      id="email"
                      name="contactEmail: "
                      onChange={this.onChange}
                      placeholder="Email"
                      required=""
                      type="email"
                    />
                  </div>
                  <input
                    className="w-full"
                    id="subject"
                    name="contactSubject: "
                    onChange={this.onChange}
                    placeholder="Subject"
                    type="text"
                  />
                  <div className="form-field">
                    <textarea
                      aria-required="true"
                      className="w-full"
                      cols="40"
                      id="message"
                      name="contactMessage: "
                      onChange={this.onChange}
                      placeholder="Message"
                      required=""
                      rows="10"
                    />
                  </div>
                  <input
                    className="submit w-full bg-gray text-button font-blocky uppercase font-bold"
                    disabled={
                      !this.state.email ||
                      !this.state.subject ||
                      !this.state.name
                    }
                    style={{
                      cursor: `${
                        !this.state.email ||
                        !this.state.subject ||
                        !this.state.name
                          ? "not-allowed"
                          : "default"
                      }`,
                    }}
                    type="submit"
                    value="Submit"
                  />
                  {this.state.response ? (
                    <div className="alert-box alert-box--info hideit">
                      <p>Info Message. Your Message Goes Here.</p>
                      <FontAwesomeIcon
                        className="alert-box__close"
                        icon={faTimes}
                      />
                    </div>
                  ) : null}
                </form>
              </div>
              <div className="w-full contact__infos">
                <h4 className=" text-white font-blocky uppercase text-navbar font-bold ">
                  Email
                </h4>
                <p>
                  nirmalhk7@gmail.com
                  <br />
                  hello@nirmalhk7.tech
                </p>
                <h4 className="h06 text-white">Address</h4>
                <p>
                  Block 5,
                  <br /> National Institute of Technology Karnataka Surathkal
                  Hostel,
                  <br /> NITK Surathkal,
                  <br /> Karnataka- 575025, India
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
export default ContactMeSection;
