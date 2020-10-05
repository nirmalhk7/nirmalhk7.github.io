import { faAngellist, faDev, faGithub, faGoodreads, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faRss, faLongArrowAltUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export class ScrollToTop extends React.Component {
  componentDidMount() {
    var mybutton = document.getElementById("myBtn");
    window.onscroll = function () {
      scrollFn();
    };
    function scrollFn() {
      if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
      } else {
        mybutton.style.display = "none";
      }
    }
  }
  render() {
    function topFunction() {
      // document.body.scrollTop = 0;
      // document.documentElement.scrollTop = 0;
    }
    // TODO fix ScrollToTop Icon
    return (
      <button onClick={topFunction()} className="go-top" id="myBtn" title="Go to top">
        <FontAwesomeIcon icon={faLongArrowAltUp} size="lg" />
      </button>
    );
  }
}

const Footer = () => {
  return (
    <footer>
      <div className="row flicker-3">
        <div className="col-full">
          <ul className="footer-social">
            <li>
              <a className="ln" href="https://www.linkedin.com/in/nirmalhk7/">
                <FontAwesomeIcon icon={faLinkedin} />
                <span>LinkedIn</span>
              </a>
            </li>

            <li>
              <a className="gi" href="https://www.github.com/nirmalhk7">
                <FontAwesomeIcon icon={faGithub} />
                <span>GitHub</span>
              </a>
            </li>

            <li>
              <a className="an" href="https://angel.co/nirmalhk7">
                <FontAwesomeIcon icon={faAngellist} />
                <span>Angellist</span>
              </a>
            </li>

            <li>
              <a className="go" href="https://www.goodreads.com/user/show/93069537-nirmal">
                <FontAwesomeIcon icon={faGoodreads} />
                <span>Goodreads</span>
              </a>
            </li>

            <li>
              <a className="srr" href="/feed.xml">
                <FontAwesomeIcon icon={faRss} />
                <span>RSS</span>
              </a>
            </li>

            <li>
              <a className="dev" href="https://dev.to/nirmalhk7">
                <FontAwesomeIcon icon={faDev} />
                <span>DEV</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="row footer-bottom">
        <div className="col-twelve">
          <div className="copyright">
            <span style={{ color: "#3d3d3d" }}>
              Made with <i className="fa fa-heart heartbeat" style={{ fontSize: "14px" }}></i> by Nirmal Khedkar
            </span>
            <span style={{ color: "#3d3d3d" }}>Last Updated: July 20, 2020</span>
          </div>
          <div className="copyright">
            <span style={{ color: "#1d1d1d" }} id="justinmaller">
              Image Credits{" "}
              <a className="hidelink" href="/" style={{ color: "#1d1d1d" }}>
                Beast Dreams II
              </a>{" "}
              by Justin Maller
            </span>
            <span style={{ color: "#1d1d1d" }}>
              Theme by{" "}
              <a className="hidelink" href="https://www.styleshout.com/" style={{ color: "#1d1d1d" }}>
                styleshout
              </a>{" "}
              (Copyright Hola 2017)
            </span>
          </div>
          <div className="go-top">
            <a className="smoothscroll" title="Back to Top" href="#top">
              <i className="im im-arrow-up" aria-hidden="true"></i>&nbsp;
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
