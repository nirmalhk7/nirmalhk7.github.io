import { faLongArrowAltUp, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { social } from "./social";
import "../assets/css/footer.module.css";

export class ScrollToTop extends React.Component {
  componentDidMount() {
    const mybutton = document.getElementById("myBtn");
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
      <button className="go-top" id="myBtn" onClick={topFunction()} title="Go to top">
        <FontAwesomeIcon icon={faLongArrowAltUp} size="lg" style={{ width: "100%", height: "100%" }} />
      </button>
    );
  }
}

const Footer = () => {
  return (
    <footer>
      <div className="row flicker-3">
        <div className="">
          <ul className="footer-social">
            {social.map((element, index) => {
              if (element.link)
                return (
                  
                  <li key={index}>
                    <a className="ln text-decoration-none" href={element.link} target="blank">
                      {/* TODO Increase Icon size in Mobile view */}
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
            <span id="justinmaller" style={{ color: "#3d3d3d" }}>
              Image Credits &nbsp;
              <a className="hidelink" href="/" style={{ color: "#3d3d3d" }}>
                Beast Dreams II
              </a>
              &nbsp; by Justin Maller
            </span>
            <span style={{ color: "#3d3d3d" }}>
              Theme by &nbsp;
              <a className="hidelink" href="https://www.styleshout.com/" style={{ color: "#3d3d3d" }}>
                styleshout
              </a>
              &nbsp;(Copyright Hola 2017)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
