import { faAngellist, faDev, faGithub, faGoodreads, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faRss, faLongArrowAltUp, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { social } from "./social";

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
      // TODO fix ScrollToTop Movement
      // document.body.scrollTop = 0;
      // document.documentElement.scrollTop = 0;
    }
    return (
      <button onClick={topFunction()} className="go-top" id="myBtn" title="Go to top">
        <FontAwesomeIcon icon={faLongArrowAltUp} size="lg" style={{ width: "100%", height: "100%" }} />
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
            {social.map((element, index) => {
              if (element.link)
                return (
                  <li key={index}>
                    <a className="ln" href={element.link}>
                      <FontAwesomeIcon icon={element.class} />
                      <span>{element.name}</span>
                    </a>
                  </li>
                );
            })}
          </ul>
        </div>
      </div>
      <div className="row footer-bottom">
        <div className="col-twelve">
          <div className="copyright">
            <span style={{ color: "#3d3d3d" }}>
              Made with <FontAwesomeIcon icon={faHeart} /> by Nirmal Khedkar
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
        </div>
      </div>
    </footer>
  );
};
export default Footer;
