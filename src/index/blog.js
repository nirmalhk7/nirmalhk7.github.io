import Link from "../components/link";

const Blog = ({ name }) => (
  <section className="bg-gradient-to-r from-accent to-accentLight" id="blog">
    <div className="narrow mx-auto pb-6 relative ">
      <div className="col-12">
        <h3 className="text-center m-0 p-0 font-blocky  not-italic leading-tight text-white text-3xl font-semibold mb-0 mt-0 uppercase">Pitlane Chat</h3>
        <h1 className="text-6xl font-bold leading-snug mt-0 text-white">Latest From The Blog</h1>
        <p className="text-white text-center m-0 p-0 text-3xl font-normal mb-16">
          I have strong views on topics like Finance, Technology, Future and
          Environment. Find me&nbsp;
          <Link className="text-white" title={name} to="/blog">
            blogging about them here
          </Link>
          .
        </p>
      </div>
    </div>
  </section>
);

export default Blog;
