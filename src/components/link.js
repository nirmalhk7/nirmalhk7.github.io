/* eslint-disable jsx-a11y/anchor-is-valid */
import Link from "next/link";

function XLink({ title, to, query, children, className }) {
  if (!query) {
    query = {};
  }
  return (
    <Link href={{ pathname: to, query }}>
      <a className={className}>{children}</a>
    </Link>
  );
}

export default XLink;
