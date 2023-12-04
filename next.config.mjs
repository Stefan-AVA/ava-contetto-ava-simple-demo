/**
 * @type {import('next').NextConfig}
 **/
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dvvjkgh94f2v6.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "ddfcdn.realtor.ca",
      },
      {
        protocol: "https",
        hostname: "ava-org-logos.s3.ca-central-1.amazonaws.com",
      },
    ],
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  experimental: {
    typedRoutes: true,
  },

  reactStrictMode: true,
}

export default config
