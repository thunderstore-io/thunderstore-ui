/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      use: {
        loader: "@svgr/webpack",
        options: {
          prettier: false,
          svgo: true,
          svgoConfig: {
            plugins: [
              {
                name: "preset-default",
                params: {
                  overrides: { removeViewBox: false },
                },
              },
            ],
          },
          titleProp: true,
        },
      },
    });

    return config;
  },
};

module.exports = nextConfig;
