const withPreconstruct = require("@preconstruct/next");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["react"],
};

module.exports = withPreconstruct(nextConfig);
