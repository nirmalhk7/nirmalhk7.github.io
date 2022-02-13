import Link from 'next/link';

function XLink({ title, to, children }) {
  return (
    <Link href={to} title={title}>
      {children}
    </Link>
  );
}

export default XLink;