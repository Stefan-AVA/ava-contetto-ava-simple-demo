/**
 * @type {import('next').NextConfig}
 **/
const config = {
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  experimental: {
    typedRoutes: true,
  },

  reactStrictMode: true,
}

export default config
