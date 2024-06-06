import { default as withPreconstruct } from "@preconstruct/next";
import bundleAnalyzer from "@next/bundle-analyzer";

/** @type {import('next').NextConfig} */
const nextConfig = withPreconstruct({
  reactStrictMode: true,
  transpilePackages: ["react"],
});

let result = nextConfig;

if (process.env.ANALYZE === "true") {
  const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === "true",
  });
  result = withBundleAnalyzer(result);
}

module.exports = result;
