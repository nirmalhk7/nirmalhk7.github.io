import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styles from "./../assets/css/contactme.module.scss";

class ContactForm extends React.Component {
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
      <div className="bootstrap-wrapper">
        <section className={`${styles.section_contact} parallax`} id="contact">
          <div className={styles.overlay} />
          <div className={`${styles.section_intro} narrow m-auto`}>
            <div className="">
              <h3 className="text-accent">Contact Me</h3>
              <h1>Say Hi!</h1>
              <p className="lead">I'll reach out to you as soon as I can.</p>
            </div>
          </div>
          <div className="container" style={{ maxWidth: "1000px" }}>
            <div className="row">
              <div
                className={`col-lg-8 col-md-8 col-sm-12 tab-full ${styles.contact__form}`}
              >
                <form method="post">
                  <input
                    className="full-width"
                    id="name"
                    name="NAME:"
                    onChange={this.onChange}
                    placeholder="Name"
                    type="text"
                  />
                  <div className="form-field">
                    <input
                      aria-required="true"
                      className="full-width"
                      id="email"
                      name="contactEmail: "
                      onChange={this.onChange}
                      placeholder="Email"
                      required=""
                      type="email"
                    />
                  </div>
                  <input
                    className="full-width"
                    id="subject"
                    name="contactSubject: "
                    onChange={this.onChange}
                    placeholder="Subject"
                    type="text"
                  />
                  <div className="form-field">
                    <textarea
                      aria-required="true"
                      className="full-width"
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
                    className="submit full-width btn"
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
              <div className="col-lg-4 col-md-4 col-sm-12 tab-full contact__infos">
                <h4 className="h06 text-white">Email</h4>
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
export default ContactForm;
