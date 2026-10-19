import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page">
      <h1>That page isn’t in the course</h1>
      <p>The lesson may have been renamed or moved. <Link href="/">Back to the course map</Link>.</p>
    </div>
  );
}
