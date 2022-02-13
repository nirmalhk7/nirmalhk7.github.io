import Link from "../components/link";

const HireMe = () => (
  <>
    <a
      className="btn btn-accent full-width text-decoration-none"
      href={"./Resume.pdf"}
      rel="noreferrer"
      style={{ marginTop: "1em" }}
      target="_blank"
    >
      Download My Resume
    </a>
    <Link
      className="smoothscroll btn btn-outline-accent full-width text-decoration-none"
      to="#contact"
    >
      Want to Hire?
    </Link>
  </>
);
export default HireMe