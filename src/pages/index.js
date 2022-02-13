import React from "react"; 
import Link from "../components/link";
// import data from '../../public/static/data.json'
import Layout from "../components/layout";
// import Image from "../components/image"
import SearchEnggOp from "../components/seo";
import SocialMediaIcons from "../components/social";
import { WorkExperience, CollegeCourses, OnlineCourses, Memberships, MySkills } from "../index/whyMe";
import HireMe from "../index/hireme";
import Projects from "../index/projects";
import Blog from "../index/blog";

export async function getStaticProps(context) {
  return {
    props: {
      data : {
        projects: [],
        workexperience: [],
        onlineCourses: [],
        collegeCourses: [],
        membership:[]
      },
      skills: {
        frameworksLibraries:[],
        languages: []
      }
    }, // will be passed to the page component as props
  };
}

const Jumbotron = () => (
  <section
    className="s-home page-hero  parallax"
    data-natural-height="2000"
    data-natural-width="3000"
    data-parallax="scroll"
    data-position-y="center"
    id="home"
  >
    <div className="overlay" />
    <div className="home-content bootstrap-wrapper">
      <div className="container home-content__main">
        <h3 className="ital-hover">Hey!</h3>
        <h1>
          I'm Nirmal Khedkar, <br />
          product developer
          {"\n"}
          based in <br />
          Surathkal, India.
        </h1>
        <div className="home-content__buttons">
          <Link className="smoothscroll  btn btn-outline-white" to="#projects">
            Latest Projects
          </Link>
          <Link className="smoothscroll  btn btn-outline-white" to="#about">
            More About Me
          </Link>
        </div>
        <div className="home-content__scroll">
          <Link
            className="scroll-link smoothscroll text-decoration-none"
            to="#about"
          >
            <span>Scroll Down</span>
          </Link>
        </div>
      </div>
    </div>
    <SocialMediaIcons />
  </section>
);



const PersonalInfo = () => (
  <div>
    <h3 id="howdy">Greetings!</h3>
    <p>
      I’m from India, and I’m final year student at National Institute of
      Technology, Karnataka. Programming, reading books, reading news, table
      tennis and
      <strong>making applications that eliminate iterative work</strong> is my
      hobby. I like to constantly challenge myself with problems. I also have a
      knack for finance and investment.
    </p>
    <h5 id="academics">Academics</h5>
    <p>
      I completed my 10th grade in Bangalore with <strong>9.4 CGPA</strong> and
      my 12th grade with 87.9%. I currently study in{" "}
      <strong>National Institute of Technology Karnataka</strong> doing BTech in
      Information Technology.
    </p>

    <h5 id="technical-projects-and-activities">
      Technical Projects and Activities
    </h5>
    <p>
      My projects are listed below. Most of them are open-sourced on GitHub.
      I’ve worked on several MERN Stack based, Native Android and Ruby on Rails
      projects. I’m also member Web Developer of IRIS NITK, which is NITK’s
      student-run university management portal. I’m also passionate about
      Machine Learning and its applications.
    </p>
  </div>
);

class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: [false, false, false, false, false],
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick = (event) => {
    event.preventDefault();
    event.persist();
    console.log(event.target.id);
    const clickedOn = parseInt(event.target.id.split("-")[1]);
    const newState = this.state.isOpen;
    newState.forEach((element, index) => {
      if (index === clickedOn) {
        newState[clickedOn] = !newState[clickedOn];
      } else {
        newState[index] = false;
      }
    });
    this.setState({
      isOpen: newState,
    });
  };
  render() {
    const {
      projects,
      workexperience,
      onlineCourses,
      collegeCourses,
      membership
    } = this.props.data;
    const {
      languages,
      frameworksLibraries
    } = this.props.skills;
    return (
      <Layout location={this.props.location}>
        <SearchEnggOp
          description="Welcome to Nirmal Khedkar's Official Website"
          title="Home"
        />
        <Jumbotron />
        <section className="s-about bootstrap-wrapper" id="about">
          <div className="w-100 text-center">
            <div className="narrow section-intro has-bottom-sep m-auto">
              <div className="col-12 text-center">
                <h3 className="text-accent">Nirmal Khedkar</h3>
                <h1>More About Me</h1>
                <p className="lead">
                  I'm a student in National Institute of Technology Karnataka
                  Surathkal doing a Bachelors in Technology (Information
                  Technology) constantly looking for new and interesting
                  challenges.
                </p>
              </div>
            </div>
          </div>
          <div className="container about-content">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12">
                <PersonalInfo />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <img
                  alt="Nirmal Khedkar"
                  className="header-image"
                  src="https://avatars.githubusercontent.com/u/25480443"
                  style={{
                    borderRadius: "70%",
                    padding: "1rem",
                    width: "70%",
                    height: "auto",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                />

                <MySkills
                  frameworksLibraries={frameworksLibraries}
                  languages={languages}
                />
                <HireMe />
              </div>
            </div>
          </div>
          <div className="container about-content">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12">
                <OnlineCourses onlineCourses={onlineCourses} />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <CollegeCourses collegeCourses={collegeCourses} />
                <Memberships membership={membership} />
              </div>
            </div>
          </div>
          <WorkExperience experience={workexperience} />
        </section>
        <Projects
          handleClick={this.handleClick}
          isOpen={this.state.isOpen}
          projects={projects}
        />
        <Blog />
      </Layout>
    );
  }
}

export default IndexPage;