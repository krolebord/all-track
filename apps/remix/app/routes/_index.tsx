import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <main>
      <h1>Hello</h1>
      <Link to={'/app'}>Go to app</Link>
    </main>
  );
}
