import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
// import Image from "../components/image"
import SEO from "../components/seo"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <section id="home" class="s-home page-hero target-section parallax" data-parallax="scroll" data-natural-width="3000" data-natural-height="2000" data-position-y="center">
      <div class="overlay"></div>
      <div class="home-content">
        <div class="row home-content__main">
          <h3>Hey!</h3>
          <h1>
            I'm Nirmal Khedkar, <br />
            product developer<br />
              based in Surathkal, India.
            </h1>
          <div class="home-content__buttons">
            <Link to="#works" class="smoothscroll btn btn--stroke">
              Latest Projects
                </Link>
            <Link to="#about" class="smoothscroll btn btn--stroke">
              More About Me
                </Link>
          </div>
          <div class="home-content__scroll">
            <Link to="#about" class="scroll-link smoothscroll">
              <span>Scroll Down</span>
            </Link>
          </div>
        </div>
      </div>
    <ul class="home-social">

        <li>
          <Link title="socialprofile" to="https://www.linkedin.com/in/nirmalhk7/">
            <i class="fab fa-linkedin ln" aria-hidden="true"></i>
            <span>LinkedIn</span>
          </Link>
        </li>

        <li>
          <Link title="socialprofile" to="https://www.github.com/nirmalhk7">
            <i class="fab fa-github gi" aria-hidden="true"></i>
            <span>GitHub</span>
          </Link>
        </li>

        <li>
          <Link title="socialprofile" to="https://angel.co/nirmalhk7">
            <i class="fab fa-angellist an" aria-hidden="true"></i>
            <span>Angellist</span>
          </Link>
        </li>

        <li>
          <Link title="socialprofile" to="https://www.goodreads.com/user/show/93069537-nirmal">
            <i class="fab fa-goodreads go" aria-hidden="true"></i>
            <span>Goodreads</span>
          </Link>
        </li>

        <li>
          <Link title="socialprofile" to="/feed.xml">
            <i class="fas fa-rss-square srr" aria-hidden="true"></i>
            <span>RSS</span>
          </Link>
        </li>

        <li>
          <Link title="socialprofile" to="https://dev.to/nirmalhk7">
            <i class="fab fa-dev dev" aria-hidden="true"></i>
            <span>DEV</span>
          </Link>
        </li>

      </ul>
    </section>
    <section id="about" class="s-about target-section">
      <div class="row narrow section-intro has-bottom-sep">
        <div class="col-full text-center">
          <h3>Nirmal Khedkar</h3>
          <h1>More About Me</h1>
          <p class="lead">I'm a student in National Institute of Technology Karnataka Surathkal doing a Bachelors in Information Technology constantly looking for new and interesting challenges.</p>
        </div>
      </div>
      <div class="row about-content">
        <div class="col-six tab-full left">
          <div class="padding-bottom:1em"><h3 id="howdy">Howdy!</h3>
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
          <Link to="\assets\pdf\Resume.pdf" class="btn btn--primary full-width" style={{ marginTop: "1em" }}>Download My Resume</Link>
          <Link to="#contact" class="smoothscroll btn btn--stroke full-width">Want to Hire?</Link>
        </div>
        <div class="col-six tab-full right">
          <h3 style={{ textAlign: "center" }}>I've got some skills.</h3>
          <div class="row">
            <h5 style={{ paddingTop: "0.5em;" }}>Languages, Frameworks, Libraries and Tools</h5>
            <hr style={{ borderColor: "#af2b2b", margin: "10px!important" }} />

            <div class="col-three minicard minicard-box">
              C/C++
            </div>
            <div class="col-three minicard minicard-box">
              JAVA
            </div>
            <div class="col-three minicard minicard-box">
              Python
            </div>
          </div>
          <div class="row">
            <h5 style={{ paddingTop: "0.5em;" }}>Online Certification and Courses Taken</h5>
            <hr style={{ borderColor: "#af2b2b", margin: "10px!important" }} />
            {/* <ul class="disc">
                
<li>Frontend Development with React by HKUST, Coursera
    
        - (<Link href=https://www.coursera.org/account/accomplishments/verify/H9S3TQR7S6ZS?utm_source=link&utm_campaign=copybutton_certificate&utm_product=course>link</Link>)
    
</li>
                
<li>Server-side Development with NodeJS, Express and MongoDB by HKUST, Coursera
    
        - (<Link href=https://www.coursera.org/account/accomplishments/verify/JXES9NLB2J5S?utm_source=link&utm_campaign=copybutton_certificate&utm_product=course>link</Link>)
    
</li>
                
<li>Introduction to Machine Learning by Stanford University, Coursera
    
</li>
                
<li>Logistic Regression with Python and Numpy by Rhyme.com
    
        - (<Link href=https://coursera.org/share/b75a7a52d7cda5595e92beab219e98e1>link</Link>)
    
</li>
                
<li>Neural Networks and Deep Learning by deeplearning.ai, Coursera
    
        - (<Link href=https://www.coursera.org/account/accomplishments/verify/MCRCWRDWYUTT?utm_source=link&utm_campaign=copybutton_certificate&utm_product=course>link</Link>)
    
</li>
                
                </ul> */}
          </div>
          <div class="row">
            <h5 style={{ paddingTop: "0.5em;" }}>College Courses Taken</h5>
            <hr style={{ borderColor: "#af2b2b", margin: "10px!important" }} />
            {/* <ul class="disc">
                
Web Technologies

    , 

                
DSA

    , 

                
Computer Networking

    , 

                
Discrete Mathematics

    , 

                
Computer Organization

    , 

                
Operating Systems

    , 

                
Database Management

                
                </ul> */}
          </div>
          <div class="row">
            <h5>Memberships</h5>
            <hr style={{ borderColor: "#af2b2b", margin: "5px!important" }} />
            <ul class="disc">
              <li>Web Developer (upto Jan 2020) at <Link to="https://www.tedxnitksurathkal.in">TEDxNITKSurathkal</Link></li>
              <li>Web Developer at <Link to="https://iris.nitk.ac.in/hrms/">IRIS NITK</Link></li>
              <li>Webmaster and Executive Member at <Link to="https://iet-nitk.github.io/">IET NITK</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="row about-content about-content--timeline">
        <div class="col-full text-center">
          <h3>My Work Experience.</h3>
        </div>

        <div class="col-six tab-full left">
          <div class="timeline">
            <div class="timeline__block">
              <div class="timeline__bullet"></div>
              <div class="timeline__header">
                <p class="timeline__timeframe">May 2019 - Present</p>
                <h3>IRIS NITK</h3>
                <h5>Web Developer (Frontend Intern upto June 2019)</h5>
              </div>
              <div class="timeline__desc">
                <p>My job as a Frontend Intern was to aid the design migration of IRIS modules like Fee Payment/Finance Module and Admissions Module. As a fulltime member, I've made and maintained a UI/UX Guideline for IRIS Members to follow. I've also worked on backend improvements in Admissions Module.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-six tab-full left">
          <div class="timeline">
            <div class="timeline__block">
              <div class="timeline__bullet"></div>
              <div class="timeline__header">
                <p class="timeline__timeframe">Dec 2019 - Present</p>
                <h3>Twzzr</h3>
                <h5>Product Developer</h5>
              </div>
              <div class="timeline__desc">
                <p>My job as a Product Developer is to oversee the web and Android products of our startup and fit it according to the needs on the ground.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-six tab-full right">
          <div class="timeline">
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

export default IndexPage
