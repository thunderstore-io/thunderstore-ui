const withPreconstruct = require("@preconstruct/next");
const withTM = require("next-transpile-modules")(["@thunderstore/cyberstorm"]);

module.exports = withTM(
  withPreconstruct({
    experimental: {
      esmExternals: "loose",
    },
  })
);
