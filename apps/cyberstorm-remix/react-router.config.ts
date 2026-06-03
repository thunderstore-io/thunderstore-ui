import type { Config } from "@react-router/dev/config";
import { sentryOnBuildEnd } from "@sentry/react-router";
import "react-router";

// // This is not needed anymore if you use v7.6.0
// declare module "react-router" {
//   interface Future {
//     unstable_middleware: true; // 👈 Enable middleware types
//   }
// }

export default {
  // ...Other options
  future: {
    // unstable_middleware: true, // 👈 Enable middleware
    // ...Other future or unstable flags
  },
  buildEnd: async (args) => {
    // Only call sentryOnBuildEnd when sentryReactRouter was registered in
    // vite.config.ts (i.e. all three Sentry build env vars are present).
    // Without the Vite plugin, sentryConfig is undefined and sentryOnBuildEnd
    // will throw trying to destructure it.
    if (
      process.env.SENTRY_AUTH_TOKEN &&
      process.env.SENTRY_ORG &&
      process.env.SENTRY_PROJECT
    ) {
      await sentryOnBuildEnd(args);
    }
  },
} satisfies Config;
