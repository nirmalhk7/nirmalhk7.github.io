import Link from "../components/link";

const Blog = ({ name }) => (
  <section className="bg-gradient-accent  bootstrap-wrapper" id="blog">
    <div className="narrow section-intro has-bottom-sep m-auto">
      <div className="col-12">
        <h3 className="text-white">{name}</h3>
        <h1 className="text-white">Latest From The Blog</h1>
        <p className="lead">
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
