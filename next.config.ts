/** @type {import('next').NextConfig} */
const nextConfig = {
  trustHost: true,

  experimental: {
    allowedDevOrigins: [
      "https://min-recent-spiritedly.ngrok-free.dev",
    ],
  },
};

module.exports = nextConfig;
