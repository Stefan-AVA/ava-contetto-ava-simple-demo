/**
 * @type {import('next').NextConfig}
 **/
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
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
