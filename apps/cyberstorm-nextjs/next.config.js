const withPreconstruct = require("@preconstruct/next");

/** @type {import('next').NextConfig} */
const nextConfig = withPreconstruct({
  reactStrictMode: true,
  transpilePackages: ["react"],
});

let result = nextConfig;

if (process.env.ANALYZE === "true") {
  const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
  });
  result = withBundleAnalyzer(result);
}

module.exports = result;
