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
    await sentryOnBuildEnd(args);
  },
} satisfies Config;
