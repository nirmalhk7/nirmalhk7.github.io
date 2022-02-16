/* eslint-disable */
import Link from "../components/link";
import styles from "../assets/css/resume.module.css";
function Resume() {
  return (
    <>
      <div id="page_1">
        <p class={styles.p0 + " text-accent " + styles.ft0}>NIRMAL KHEDKAR</p>
        <p class={styles.p1 + " " + styles.ft1}>Software Developer</p>
        <p class={styles.p2 + " " + styles.ft3}>
          <span className={styles.ft1}>¯</span>
          <a href="https://www.linkedin.com/in/nirmalhk7/">
            <span className={styles.ft2}>@nirmalhk7 </span>
          </a>
          <span className={styles.ft1}> ‡ </span>
          <a href="https://www.github.com/nirmalhk7/">@nirmalhk7 </a>
          <span class={styles.ft1}> ® </span>
          <a href="https://nirmalhk7.tech">https://nirmalhk7.tech</a>
        </p>
        <p class={styles.p3 + " " + styles.ft3}>
          <span className={styles.ft4}>Ó</span>
          <span className={styles.ft5}>‰ </span>
          <a href="tel:+919356649190">(+91) 9356649190 </a>
          <span className={styles.ft1}> R </span>
          <a href="mailto:nirmalhk7@gmail.com">nirmalhk7@gmail.com</a>
        </p>
        <p class={styles.p4 + " " + styles.ft1}>EDUCATION</p>
        <table cellpadding="0" cellspacing="0" class={styles.t0}>
          <tr>
            <td class={styles.tr0 + " " + styles.td0}>
              <p class={styles.p5 + " " + styles.ft1}>
                <a href="nitk.ac.in">
                  National Institute of Technology Karnataka
                </a>
              </p>
            </td>
            <td class={styles.tr0 + " " + styles.td1}>
              <p class={styles.p6 + " " + styles.ft1}>June 2018 - Present</p>
            </td>
          </tr>
          <tr>
            <td class={styles.tr1 + " " + styles.td0}>
              <p class={styles.p5 + " " + styles.ft1}>
                Undergraduate, Bachelor of Technology
              </p>
            </td>
            <td class={styles.tr1 + " " + styles.td1}>
              <p class={styles.p6 + " " + styles.ft1}>Overall GPA: 7.3/10</p>
            </td>
          </tr>
          <tr>
            <td class={styles.tr2 + " " + styles.td0}>
              <p class={styles.p5 + " " + styles.ft1}>
                Department of
                <a href="infotech.nitk.ac.in">Information Technology</a>
              </p>
            </td>
            <td class={styles.tr2 + " " + styles.td1}>
              <p class={styles.p6 + " " + styles.ft4}>Currently 7th Semester</p>
            </td>
          </tr>
        </table>
        <p class={styles.p7 + " " + styles.ft1}>TECHNICAL STRENGTHS</p>
        <table cellpadding="0" cellspacing="0" className={styles.t1}>
          {Array(3)
            .fill(1)
            .map((e) => (
              <tr>
                <td class={styles.tr0 + " " + styles.td2}>
                  <p class={styles.p5 + " " + styles.ft1}>Languages</p>
                </td>
                <td class={styles.tr0 + " " + styles.td3}>
                  <p class={styles.p5 + " " + styles.ft1}>
                    C/C++, Java, Python, Javascript
                  </p>
                </td>
              </tr>
            ))}
        </table>
        <p class={styles.p8 + " " + styles.ft1}>EXPERIENCE AND ACHIEVEMENTS</p>
        {Array(2)
          .fill(1)
          .map((e) => (
            <>
              <table cellpadding="0" cellspacing="0" className={styles.t2}>
                <tr>
                  <td class={styles.tr0 + " " + styles.td4}>
                    <p class={styles.p5 + " " + styles.ft1}>
                      <a href="visa.com">Visa Inc.</a>
                    </p>
                  </td>
                  <td class={styles.tr0 + " " + styles.td5}>
                    <p class={styles.p5 + " " + styles.ft1}>Internship</p>
                  </td>
                </tr>
                <tr>
                  <td class={styles.tr0 + " " + styles.td4}>
                    <p class={styles.p5 + " " + styles.ft1}>
                      May 2021 - July 2021
                    </p>
                  </td>
                  <td class={styles.tr0 + " " + styles.td5}>
                    <p class={styles.p5 + " " + styles.ft6}>&nbsp;</p>
                  </td>
                </tr>
              </table>
              <p class={styles.p9 + " " + styles.ft1}>
                <span class={styles.ft1}>-</span>
                <span className={styles.ft5}>
                  Coordinated with different Visa teams and listed out various
                  metrics collected from Visa Developer Platform (VDP).
                </span>
              </p>
              <p class={styles.p10 + " " + styles.ft1}>
                <span className={styles.ft1} class={styles.ft1}>
                  -
                </span>
                <span className={styles.ft7} class={styles.ft7}>
                  Collaborated and developed a{" "}
                </span>
                <nobr>full-stack</nobr> website with GraphQL APIs to court VDP
                clients, developers and product developers and provide pooled
                VDP data from one single source.
              </p>
            </>
          ))}

        <p class={styles.p13 + " " + styles.ft1}>PROJECTS</p>
        {Array(5)
          .fill(1)
          .map((e) => (
            <>
              <table cellpadding="0" cellspacing="0" class={styles.t4}>
                <tr>
                  <td class={styles.tr0 + " " + styles.td10}>
                    <p class={styles.p5 + " " + styles.ft1}>CollegeGO</p>
                  </td>
                  <td class={styles.tr0 + " " + styles.td11}>
                    <p class={styles.p5 + " " + styles.ft1}>Android (JAVA)</p>
                  </td>
                </tr>
                <tr>
                  <td class={styles.tr0 + " " + styles.td10}>
                    <p class={styles.p5 + " " + styles.ft3}>
                      <a href="https://play.google.com/store/apps/details?id=com.nirmalhk7.collegego">
                        Play Store
                      </a>
                    </p>
                  </td>
                  <td class={styles.tr0 + " " + styles.td11}>
                    <p class={styles.p5 + " " + styles.ft6}>&nbsp;</p>
                  </td>
                </tr>
              </table>
              <p class={styles.p14 + " " + styles.ft1}>
                Developed an Android app aimed to facilitate a college going
                student: complete with CRUD function- alities for exams,
                holidays and daily timetable.
              </p>
            </>
          ))}
      </div>
    </>
  );
}

export default Resume;
