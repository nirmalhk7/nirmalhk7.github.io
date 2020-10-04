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
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
    return (
      <button onclick={topFunction()} id="myBtn" title="Go to top">
        <i class="fa fa-long-arrow-alt-up" style={{ color: "white" }}></i>
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
                <i className="fab fa-linkedin ln" aria-hidden="true"></i>
                <span>LinkedIn</span>
              </a>
            </li>

            <li>
              <a className="gi" href="https://www.github.com/nirmalhk7">
                <i className="fab fa-github gi" aria-hidden="true"></i>
                <span>GitHub</span>
              </a>
            </li>

            <li>
              <a className="an" href="https://angel.co/nirmalhk7">
                <i className="fab fa-angellist an" aria-hidden="true"></i>
                <span>Angellist</span>
              </a>
            </li>

            <li>
              <a className="go" href="https://www.goodreads.com/user/show/93069537-nirmal">
                <i className="fab fa-goodreads go" aria-hidden="true"></i>
                <span>Goodreads</span>
              </a>
            </li>

            <li>
              <a className="srr" href="/feed.xml">
                <i className="fas fa-rss-square srr" aria-hidden="true"></i>
                <span>RSS</span>
              </a>
            </li>

            <li>
              <a className="dev" href="https://dev.to/nirmalhk7">
                <i className="fab fa-dev dev" aria-hidden="true"></i>
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
