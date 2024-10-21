/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'pocket.leaselogic.app',
      },
    ],
  },
};

export default nextConfig;
