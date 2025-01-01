import withPWA from "next-pwa";

const nextConfig = withPWA({
  dest: "public", // Output folder for service worker files
  register: true,
  skipWaiting: true,
});

export default nextConfig;