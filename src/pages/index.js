import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div>
    <Link to="/page-2/">Go to page 2</Link> <br />
    <Link to="/using-typescript/">Go to "Using TypeScript"</Link>
    <section id="works" className="s-works target-section">
      <div className="row">
        <div className="col-six tab-full right">
          <div className="narrow section-intro has-bottom-sep">
            <div className="col-full">
              <h3>Works</h3>
              <h1>See My Latest Projects.</h1>
              <p className="lead">Find my projects <a href="http://localhost:4000/project">categorized here</a>.
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

                  <p>I’ve tried making something I’ve always been fascinated with: web scrapers. I’ve followed <a href="https://www.tutorialspoint.com/python_web_scraping/index.htm">this tutorial for webscraping</a> , and I’m making a complete web scrapper which I’ve baptised as Silver-Scrappy because I just did.
<a href="https://github.com/nirmalhk7/silver-scrappy">Link</a></p>

                  <a href="http://localhost:4000/project#Silver-Scrappie">Find more here</a>.&nbsp;&nbsp;&nbsp;<code>Python</code>

                </div>
              </div>
            </div>
            <div className="accordion__item js-accordion-item">
              <div className="accordion-header js-accordion-header">AgriBazaar</div>
              <div className="accordion-body js-accordion-body">
                <div className="accordion-body__contents">

                  <p>E-Commerce website for farmers.
<a href="https://github.com/nirmalhk7/farmer-Market">Link</a></p>
                  <a href="http://localhost:4000/project#AgriBazaar">Find more here</a>.&nbsp;&nbsp;&nbsp;<code>NodeJS, React</code>
                </div>
              </div>
            </div>

            <div className="accordion__item js-accordion-item">
              <div className="accordion-header js-accordion-header">CollegeGO</div>
              <div className="accordion-body js-accordion-body">
                <div className="accordion-body__contents">
                  <p>App to facilitate a college going student. Includes timetable, attendance logging and exam and holidays reminder.</p>
                  <a href="http://localhost:4000/project#CollegeGO">Find more here</a>.&nbsp;&nbsp;&nbsp;<code>Android</code>
                </div>
              </div>
            </div>
            <div className="accordion__item js-accordion-item">
              <div className="accordion-header js-accordion-header">Crypto</div>
              <div className="accordion-body js-accordion-body">
                <div className="accordion-body__contents">
                  <p>Built with Diffie Hellman principles. Wanna get that James Bond feeling?</p>
                  <a href="http://localhost:4000/project#Crypto">Find more here</a>.&nbsp;&nbsp;&nbsp;<code>C++</code>
                </div>
              </div>
            </div>
            <div className="accordion__item js-accordion-item">
              <div className="accordion-header js-accordion-header">First Aid Man</div>
              <div className="accordion-body js-accordion-body">
                <div className="accordion-body__contents">
                  <p>Built by Dialogflow, it makes life-saving first aid information only a “Hey Google” away.</p>
                  <a href="http://localhost:4000/project#First Aid Man">Find more here</a>.&nbsp;&nbsp;&nbsp;<code>Dialogflow</code>
                </div>
              </div>
            </div>
          </div>
        </div>e
      </div>
    </section>
    <section id="blog" className="s-works target-section">
      <div className="row narrow section-intro has-bottom-sep">
        <div className="col-full">
          <h3>Spaceride</h3>
          <h1>Latest From The Blog.</h1>
          <p className="lead">I have strong views on topics like Finance, Technology, Future and Environment. Find me <a title="blog link" href="/blog">blogging about them here</a>.</p>
        </div>
      </div>
    </section>
  </Layout>
)

export default IndexPage
