module.exports = {
  webpack: (config) => {
    config.module.rules.forEach((rule) => {
      if (rule.test && rule.test.toString().includes("tsx|ts")) {
        rule.include = [
          ...rule.include,
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          require("path").join(__dirname, ".."),
        ];
      }
    });
    return config;
  },
};
