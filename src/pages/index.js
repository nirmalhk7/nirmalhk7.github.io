import React from "react";
import Link from "../components/link";
// import data from '../../public/static/data.json'
// import Image from "../components/image"
import SearchEnggOp from "../components/seo";
import SocialMediaIcons from "../components/social";
import {
  WorkExperience,
  CollegeCourses,
  OnlineCourses,
  Memberships,
  MySkills,
} from "../index/whyMe";
import HireMe from "../index/hireme";
import Projects from "../index/projects";
import Blog from "../index/blog";
import { ProjectsService } from "../services/projectService";

export async function getStaticProps(context) {
  const projectsService = new ProjectsService();
  const pjs = await projectsService.brief();
  const courses=require("../../content/yml/courses.yaml");

  return {
    props: {
      data: {
        projects: pjs,
        workexperience: require("../../content/yml/workexperiences.yaml"),
        onlineCourses: courses.filter((course)=> course.provider),
        collegeCourses: courses.filter((course)=> !course.provider),
        membership: require("../../content/yml/memberships.yaml"),
      },
      skills: {
        frameworksLibraries: [],
        languages: [],
      },
    }, // will be passed to the page component as props
  };
}

const Jumbotron = () => (
  <section
    className="w-full bg-cover h-screen relative bg-no-repeat bg-fixed bg-center  table bg-transparent bg-beach page-hero | s-home  parallax"
    data-natural-height="2000"
    data-natural-width="3000"
    data-parallax="scroll"
    data-position-y="center"
    id="home"
  >
    <div className="h-full left-0 opacity-50 absolute top-0 w-full bg-black | overlay" />
    <div className="home-content">
      <div className="sm:container mx-auto content-center  home-content__main">
        <h3 className="ital-hover before:block before:h-0 before:left-0 before:mt-0 before:absolute before:w-16 before:content-[''] text-accent font-blocky text-navbar uppercase font-bold">
          Hey!
        </h3>
        <h1 className="text-white">
          I'm Nirmal Khedkar, <br />
          product developer
          {"\n"}
          based in <br />
          Surathkal, India.
        </h1>
        <div className="font-blocky font-bold text-navbar uppercase home-content__buttons">
          <Link
            className="smoothscroll px-12 text-white  btn bg-transparent no-underline  leading-[4.8rem] border-solid border-2 border-white"
            to="#projects"
          >
            Latest Projects
          </Link>
          <Link
            className="smoothscroll px-12 text-white btn bg-transparent no-underline border-solid border-2 border-white"
            to="#about"
          >
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
    <h3>Greetings!</h3>
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
      membership,
    } = this.props.data;
    const { languages, frameworksLibraries } = this.props.skills;
    return (
      <>
        <Jumbotron />
        <section className=" pt-36	 pb-36 bg-white relative | s-about" id="about">
          <div className="w-100 text-center">
            <div className="max-w-screen-md	text-center relative sm:container-md pb-6 | narrow section_intro m-auto">
              <div className="text-center">
                <h3 className="font-blocky font-semibold uppercase tracking-[.15rem] mb-0 mt-0 text-accent w-full">
                  Nirmal Khedkar
                </h3>
                <h1
                  style={{
                    fontFamily: "Libre Baskerville, serif",
                    fontSize: "4.8rem",
                    fontWeight: 700,
                    lineHeight: 1.375,
                    marginTop: 0,
                  }}
                >
                  More About Me
                </h1>
                <p className="font-normal text-h4 mb-16 font-blocky leading-7">
                  I'm a student in National Institute of Technology Karnataka
                  Surathkal doing a Bachelors in Technology (Information
                  Technology) constantly looking for new and interesting
                  challenges.
                </p>
              </div>
            </div>
          </div>
          <div className="sm:container mx-auto about-content">
            <div className="grid grid-cols-2">
              <div>
                <PersonalInfo />
              </div>
              <div>
                <img
                  alt="Nirmal Khedkar"
                  className="header-image"
                  // src="https://avatars.githubusercontent.com/u/25480443"
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
          <div className="sm:container mx-auto about-content">
            <div className="grid grid-cols-2 gap-10">
              <div>
                <OnlineCourses onlineCourses={onlineCourses} />
              </div>
              <div>
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
      </>
    );
  }
}

export default IndexPage;
