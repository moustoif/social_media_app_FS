import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
  serverExternalPackages: ["@node-rs/argon2"],
  images: {
    domains : [ 'utfs.io'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: '',
        pathname: `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
      },
    ],
  },
  rewrites: async() => {
    return [
      {
        source: "/hashtag/:tag",
        destination: "/search?q=%23:tag",
      },
    ];
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
