import React from "react"
import { Link } from "gatsby"
// import data from '../../public/static/data.json'
import Layout from "../components/layout"
// import Image from "../components/image"
import SEO from "../components/seo"
import skills from "../../data/skills.yaml";
import experience from "../../data/workexperiences.yaml";
import courses from "../../data/courses.yaml";
import clubs from "../../data/memberships.yaml";

class IndexPage extends React.Component {
  render() {
    return (
      <Layout location={this.props.location}>
        <SEO title="Home" />
        <section id="home" className="s-home page-hero target-section parallax" data-parallax="scroll" data-natural-width="3000" data-natural-height="2000" data-position-y="center">
          <div className="overlay"></div>
          <div className="home-content">
            <div className="row home-content__main">
              <h3>Hey!</h3>
              <h1>
                I'm Nirmal Khedkar, <br />
            product developer<br />
              based in Surathkal, India.
            </h1>
              <div className="home-content__buttons">
                <Link to="#works" className="smoothscroll btn btn--stroke">
                  Latest Projects
                </Link>
                <Link to="#about" className="smoothscroll btn btn--stroke">
                  More About Me
                </Link>
              </div>
              <div className="home-content__scroll">
                <Link to="#about" className="scroll-link smoothscroll">
                  <span>Scroll Down</span>
                </Link>
              </div>
            </div>
          </div>
          <ul className="home-social">



            <li>
              <Link title="socialprofile" to="https://www.github.com/nirmalhk7">
                <i className="fab fa-github gi" aria-hidden="true"></i>
                <span>GitHub</span>
              </Link>
            </li>

            <li>
              <Link title="socialprofile" to="https://angel.co/nirmalhk7">
                <i className="fab fa-angellist an" aria-hidden="true"></i>
                <span>Angellist</span>
              </Link>
            </li>

            <li>
              <Link title="socialprofile" to="https://www.goodreads.com/user/show/93069537-nirmal">
                <i className="fab fa-goodreads go" aria-hidden="true"></i>
                <span>Goodreads</span>
              </Link>
            </li>

            <li>
              <Link title="socialprofile" to="/feed.xml">
                <i className="fas fa-rss-square srr" aria-hidden="true"></i>
                <span>RSS</span>
              </Link>
            </li>

            <li>
              <Link title="socialprofile" to="https://dev.to/nirmalhk7">
                <i className="fab fa-dev dev" aria-hidden="true"></i>
                <span>DEV</span>
              </Link>
            </li>

          </ul>
        </section>
        <section id="about" className="s-about target-section">
          <div className="row narrow section-intro has-bottom-sep">
            <div className="col-full text-center">
              <h3>Nirmal Khedkar</h3>
              <h1>More About Me</h1>
              <p className="lead">I'm a student in National Institute of Technology Karnataka Surathkal doing a Bachelors in Information Technology constantly looking for new and interesting challenges.</p>
            </div>
          </div>
          <div className="row about-content">
            <div className="col-six tab-full left">
              <div className="padding-bottom:1em"><h3 id="howdy">Howdy!</h3>
                <p>I’m from India, and I’m second year student at National Institute of Technology, Karnataka. Programming, reading books, reading news, table tennis and <strong>making applications that eliminate iterative work</strong> is my hobby. I like to constantly challenge myself with problems. I also have a knack for finance and investment.</p>
                <h5 id="academics">Academics</h5>
                <p>I completed my 10th grade in Bangalore with <strong>9.4 CGPA</strong> and my 12th grade with
87.9%. I currently study in <strong>National Institute of Technology Karnataka</strong> doing BTech in Information Technology and have <em>7.06</em> CGPA<small>(as of May 2019)</small></p>

                <h5 id="technical-projects-and-activities">Technical Projects and Activities</h5>
                <p>My projects are listed below. Most of them are open-sourced on GitHub. I’ve worked on several MERN Stack based, Native Android and Ruby on Rails projects. I’m also member Web Developer of IRIS NITK, which is NITK’s student-run university management portal. I’m also passionate about Machine Learning and its applications.</p>

                <h5 id="finance">Finance</h5>
                <p>I strongly think that the best way to earn more is to read more about exactly how money works.
As a student, I love to read about money, stock markets and financial incidents around the world.</p>
              </div>
              <Link to="Resume.pdf" className="btn btn--primary full-width" style={{ marginTop: "1em" }}>Download My Resume</Link>
              <Link to="#contact" className="smoothscroll btn btn--stroke full-width">Want to Hire?</Link>
            </div>
            <div className="col-six tab-full right">
              <h3 style={{ textAlign: "center" }}>I've got some skills.</h3>
              <div className="row">
                <h5 style={{ paddingTop: "0.5em" }}>Languages, Frameworks, Libraries and Tools</h5>
                <hr style={{ borderColor: "#af2b2b", margin: "10px!important" }} />
                {skills.languages.map((element, index) =>
                  <div key={index} className="col-three minicard">
                    {element.name}
                  </div>
                )}
                {skills.frameworks_libraries.map((element, index) =>
                  <div key={index} className="col-three minicard">
                    {element.name}
                  </div>
                )}
                {skills.tools.map((element, index) =>
                  <div key={index} className="col-three minicard">
                    {element.name}
                  </div>
                )}
              </div>
              <div className="row">
                <h5 style={{ paddingTop: "0.5em;" }}>Online Certification and Courses Taken</h5>
                <hr style={{ borderColor: "#af2b2b", margin: "10px!important" }} />
                <ul className="disc">
                  {courses.online.map((element, index) =>
                    <li key={index}>{element.name} by {element.provider}
                  - (<Link to={element.link}>link</Link>)
                    </li>
                  )}
                </ul>
              </div>
              <div className="row">
                <h5 style={{ paddingTop: "0.5em;" }}>College Courses Taken</h5>
                <hr style={{ borderColor: "#af2b2b", margin: "10px!important" }} />
                <ul className="disc">
                  {courses.college.map((element, index) => { return <x style={{ paddingRight: "0.5em" }} key={index}>{element}</x> })}
                </ul>
              </div>
              <div className="row">
                <h5>Memberships</h5>
                <hr style={{ borderColor: "#af2b2b", margin: "5px!important" }} />
                <ul className="disc">
                  {clubs.map((element, index) =>
                    <li key={index}>{element.position} at <Link to={element.clubwebsite}>{element.club}</Link></li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div className="row about-content about-content--timeline">
            <div className="col-full text-center">
              <h3>My Work Experience.</h3>
            </div>
            {experience.map((element, index) =>
              <div className="col-six tab-full left">
                <div className="timeline">
                  <div className="timeline__block">
                    <div className="timeline__bullet"></div>
                    <div className="timeline__header">
                      <p className="timeline__timeframe">{element.timeframe}</p>
                      <h3>{element.company}</h3>
                      <h5>{element.post}</h5>
                    </div>
                    <div className="timeline__desc">
                      <p>
                        {element.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="col-six tab-full right">
              <div className="timeline">
              </div>
            </div>
          </div>
        </section>
        <section id="works" className="s-works target-section">
          <div className="row">
            <div className="col-six tab-full right">
              <div className="narrow section-intro has-bottom-sep">
                <div className="col-full">
                  <h3>Works</h3>
                  <h1>See My Latest Projects.</h1>
                  <p className="lead">Find my projects <Link to="/project">categorized here</Link>.
</p>
                </div>
              </div>
            </div>
            <div className="col-six tab-full left">
              <div className="accordion js-accordion">


                <div className="accordion__item js-accordion-item">
                  <div className="accordion-header js-accordion-header">Silver-Scrappie</div>
                  <div className="accordion-body js-accordion-body">
                    <div className="accordion-body__contents">
                      <p>I’ve tried making something I’ve always been fascinated with: web scrapers. I’ve followed <Link to="https://www.tutorialspoint.com/python_web_scraping/index.htm">this tutorial for webscraping</Link> , and I’m making a complete web scrapper which I’ve baptised as Silver-Scrappy because I just did.
<Link to="https://github.com/nirmalhk7/silver-scrappy">Link</Link></p>
                      <Link to="/project#Silver-Scrappie">Find more here</Link>.&nbsp;&nbsp;&nbsp;<code>Python</code>
                    </div>
                  </div>
                </div>
                <div className="accordion__item js-accordion-item">
                  <div className="accordion-header js-accordion-header">AgriBazaar</div>
                  <div className="accordion-body js-accordion-body">
                    <div className="accordion-body__contents">

                      <p>E-Commerce website for farmers.
<Link to="https://github.com/nirmalhk7/farmer-Market">Link</Link></p>
                      <Link to="/project#AgriBazaar">Find more here</Link>.&nbsp;&nbsp;&nbsp;<code>NodeJS, React</code>
                    </div>
                  </div>
                </div>

                <div className="accordion__item js-accordion-item">
                  <div className="accordion-header js-accordion-header">CollegeGO</div>
                  <div className="accordion-body js-accordion-body">
                    <div className="accordion-body__contents">
                      <p>App to facilitate a college going student. Includes timetable, attendance logging and exam and holidays reminder.</p>
                      <Link to="/project#CollegeGO">Find more here</Link>.&nbsp;&nbsp;&nbsp;<code>Android</code>
                    </div>
                  </div>
                </div>
                <div className="accordion__item js-accordion-item">
                  <div className="accordion-header js-accordion-header">Crypto</div>
                  <div className="accordion-body js-accordion-body">
                    <div className="accordion-body__contents">
                      <p>Built with Diffie Hellman principles. Wanna get that James Bond feeling?</p>
                      <Link to="/project#Crypto">Find more here</Link>.&nbsp;&nbsp;&nbsp;<code>C++</code>
                    </div>
                  </div>
                </div>
                <div className="accordion__item js-accordion-item">
                  <div className="accordion-header js-accordion-header">First Aid Man</div>
                  <div className="accordion-body js-accordion-body">
                    <div className="accordion-body__contents">
                      <p>Built by Dialogflow, it makes life-saving first aid information only a “Hey Google” away.</p>
                      <Link to="/project#First Aid Man">Find more here</Link>.&nbsp;&nbsp;&nbsp;<code>Dialogflow</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="blog" className="s-works target-section">
          <div className="row narrow section-intro has-bottom-sep">
            <div className="col-full">
              <h3>Spaceride</h3>
              <h1>Latest From The Blog.</h1>
              <p className="lead">I have strong views on topics like Finance, Technology, Future and Environment. Find me <Link title="blog link" to="/blog">blogging about them here</Link>.</p>
            </div>
          </div>
        </section>
      </Layout>
    )
  }
}

export default IndexPage
