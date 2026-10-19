/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lessons and puzzles are read from CONTENT_DIR at request time, not bundled.
  poweredByHeader: false,
};
export default nextConfig;
