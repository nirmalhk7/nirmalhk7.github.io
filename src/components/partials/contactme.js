import React from "react";

const ContactForm = () => {
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
            <input type="text" name="NAME:" className="full-width" placeholder="Name" />
            <div className="form-field">
              <input
                name="contactEmail: "
                type="email"
                id="contactEmail"
                placeholder="Email"
                required=""
                aria-required="true"
                className="full-width"
              />
            </div>
            <input
              name="contactSubject: "
              type="text"
              id="contactSubject"
              placeholder="Subject"
              className="full-width"
            />
            <div className="form-field">
              <textarea
                name="contactMessage: "
                id="contactMessage"
                placeholder="Message"
                rows="10"
                cols="40"
                required=""
                aria-required="true"
                className="full-width"
              />
            </div>
            <input type="submit" value="Submit" className="submit full-width btn" />
            <div className="alert-box alert  hideit">
              <p className="alertbox"></p>
              <i className="im im-x-mark alert-box__close"></i>
            </div>
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
};
export default ContactForm;
