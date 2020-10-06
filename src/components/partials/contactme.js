import { faCalculator, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Axios from "axios";
import React from "react";

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
      <section id="contact" className="s-contact target-section fadeIn">
        <div className="overlay"></div>
        <div className="row narrow section-intro">
          <div className="col-full">
            <h3>Contact Me</h3>
            <h1>Say Hi!</h1>
            <p className="lead">I'll reach you out as soon as I can.</p>
          </div>
        </div>
        <div className="row contact__main">
          <div className="col-eight tab-full contact__form">
            <form
              action="https://getsimpleform.com/messages?form_api_token=162ff4fa2bb9c89f908b059c33b0a806"
              method="post"
            >
              <input
                type="text"
                name="NAME:"
                id="name"
                onChange={this.onChange}
                className="full-width"
                placeholder="Name"
              />
              <div className="form-field">
                <input
                  name="contactEmail: "
                  type="email"
                  id="email"
                  onChange={this.onChange}
                  placeholder="Email"
                  required=""
                  aria-required="true"
                  className="full-width"
                />
              </div>
              <input
                name="contactSubject: "
                type="text"
                id="subject"
                onChange={this.onChange}
                placeholder="Subject"
                className="full-width"
              />
              <div className="form-field">
                <textarea
                  name="contactMessage: "
                  id="message"
                  placeholder="Message"
                  rows="10"
                  onChange={this.onChange}
                  cols="40"
                  required=""
                  aria-required="true"
                  className="full-width"
                />
              </div>
              <input
                type="submit"
                value="Submit"
                disabled={!this.state.email || !this.state.subject || !this.state.name}
                className="submit full-width btn"
                style={{
                  cursor: `${!this.state.email || !this.state.subject || !this.state.name ? "not-allowed" : "default"}`,
                }}
              />
              {this.state.response ? (
                <>
                  <div class="alert-box alert-box--info hideit">
                    <p>Info Message. Your Message Goes Here.</p>
                    <FontAwesomeIcon icon={faTimes} className="alert-box__close" />
                  </div>
                </>
              ) : (
                <></>
              )}
            </form>
          </div>
          <div className="col-four tab-full contact__infos">
            <h4 className="h06">Email</h4>
            <p>
              nirmalhk7@gmail.com
              <br />
              nirmalhk7@programmer.net
            </p>
            <h4 className="h06">Address</h4>
            <p>
              Block 5,
              <br /> National Institute of Technology Karnataka Surathkal Hostel,
              <br /> NITK Surathkal,
              <br /> Karnataka- 575025, India
            </p>
          </div>
        </div>
      </section>
    );
  }
}
export default ContactForm;
