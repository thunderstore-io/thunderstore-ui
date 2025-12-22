import { spawn } from "node:child_process";
import process from "node:process";

function usage(exitCode = 1) {
  // Keep this short: it shows up in CI logs.
  console.error(
    "Usage: node tools/scripts/run_test_container.mjs <test|coverage> [-- <vitest args...>]"
  );
  process.exit(exitCode);
}

function spawnLogged(command, args, options = {}) {
  const printable = [command, ...args].join(" ");
  console.log(printable);

  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: false,
      ...options,
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        const err = new Error(`${printable} failed with exit code ${code}`);
        err.exitCode = code;
        reject(err);
      }
    });
  });
}

async function waitForDjangoInContainer(
  composeFile,
  { timeoutMs = 120_000, pollMs = 1_000 } = {}
) {
  const deadline = Date.now() + timeoutMs;

  const pythonCheck =
    "import http.client, sys; " +
    "c=http.client.HTTPConnection('127.0.0.1',8000,timeout=2); " +
    "c.request('GET','/'); " +
    "r=c.getresponse(); " +
    "sys.exit(0 if 200 <= r.status < 400 else 1)";

  while (Date.now() < deadline) {
    try {
      await spawnLogged(
        "docker",
        [
          "compose",
          "-f",
          composeFile,
          "exec",
          "-T",
          "django",
          "python",
          "-c",
          pythonCheck,
        ],
        {
          env: process.env,
          stdio: "ignore",
        }
      );
      return;
    } catch {
      // ignore until timeout
    }

    const remainingSeconds = Math.max(
      0,
      Math.round((deadline - Date.now()) / 1000)
    );
    console.log(
      `Waiting for django to be ready inside container (${remainingSeconds}s remaining)`
    );
    await new Promise((r) => setTimeout(r, pollMs));
  }

  throw new Error("Timed out waiting for django to be ready inside container");
}

function parseArgs(argv) {
  const [subcommand, ...rest] = argv;
  if (!subcommand || subcommand === "-h" || subcommand === "--help") {
    usage(0);
  }

  if (subcommand !== "test" && subcommand !== "coverage") {
    console.error(`Unknown subcommand: ${subcommand}`);
    usage(1);
  }

  const dashDashIndex = rest.indexOf("--");
  // Yarn v1 forwards args without requiring `--`. Accept both forms:
  //   yarn test:container path/to/test
  //   yarn test:container -- path/to/test
  const vitestArgs =
    dashDashIndex === -1 ? rest : rest.slice(dashDashIndex + 1);

  return { subcommand, vitestArgs };
}

async function main() {
  const { subcommand, vitestArgs } = parseArgs(process.argv.slice(2));

  const backendComposeFile =
    "tools/thunderstore-test-backend/docker-compose.yml";

  // The test runner executes *inside* Docker. That container can resolve
  // service names like `django`, but it can't resolve the host-published
  // address `127.0.0.1:8000`. Override the backend's canonical host so
  // redirects stay usable from within the container network.
  const backendComposeEnv = {
    ...process.env,
    PRIMARY_HOST: process.env.PRIMARY_HOST ?? "django:8000",
  };

  try {
    // Start backend in the background.
    await spawnLogged(
      "docker",
      [
        "compose",
        "-f",
        backendComposeFile,
        "up",
        "-d",
        "--remove-orphans",
        "--build",
        // Only start backend dependencies; the same compose file also contains
        // the test runner services.
        "db",
        "redis",
        "rabbitmq",
        "minio",
        "django",
      ],
      { env: backendComposeEnv }
    );

    // Wait until it's actually serving traffic (cold starts can take a while).
    // We probe from inside the container network so we don't depend on any
    // published host port and we implicitly wait for the backend setup
    // commands inside the containers to finish.
    await waitForDjangoInContainer(backendComposeFile, { timeoutMs: 300_000 });

    const command = subcommand === "test" ? "test" : "coverage";

    const args = [
      "compose",
      "-f",
      backendComposeFile,
      "run",
      "--rm",
      "--build",
      "cyberstorm-tests",
      "yarn",
      command,
      ...vitestArgs,
    ];

    await spawnLogged("docker", args, { env: backendComposeEnv });
  } finally {
    // Always tear down the test backend so it doesn't conflict with dev.
    await spawnLogged(
      "docker",
      ["compose", "-f", backendComposeFile, "down", "--remove-orphans"],
      { env: backendComposeEnv }
    ).catch(() => {
      // Best-effort cleanup.
    });
  }
}

main().catch((err) => {
  console.error(err?.stack || String(err));
  process.exit(typeof err?.exitCode === "number" ? err.exitCode : 1);
});
