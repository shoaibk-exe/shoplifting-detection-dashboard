/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    // domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: ""
      },
      {
        protocol: "https",
        hostname: "customportalforcurl.s3.ap-south-1.amazonaws.com",
        port: ""
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: ""
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: ""
      },
      {
        protocol: "https",
        hostname: "pub-b7fd9c30cdbf439183b75041f5f71b92.r2.dev",
        port: ""
      }
    ]
  },
  // Optimize for faster dev builds
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-hot-toast'],
  },
  // Reduce compilation overhead
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Faster refresh in dev mode
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;
