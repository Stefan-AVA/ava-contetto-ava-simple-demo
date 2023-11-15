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
