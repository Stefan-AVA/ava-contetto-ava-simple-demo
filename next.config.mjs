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

  webpack: (config) => {
    config.externals = [...config.externals, { canvas: "canvas" }]

    return config
  },

  experimental: {
    typedRoutes: true,
    esmExternals: "loose",
  },

  reactStrictMode: true,
}

export default config
