import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="not-found container">
      <span className="eyebrow">404 / PAGE NOT FOUND</span>
      <h1>A little off course.</h1>
      <p>This page doesn’t exist. Let’s get you back to the team.</p>
      <Link className="button primary" href="/">
        Back to CyberGuard →
      </Link>
    </main>
  );
}
