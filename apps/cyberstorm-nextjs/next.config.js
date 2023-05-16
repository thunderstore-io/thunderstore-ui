const withPreconstruct = require("@preconstruct/next");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["react"],
  experimental: {
    serverActions: true,
  },
};

module.exports = withPreconstruct(nextConfig);
