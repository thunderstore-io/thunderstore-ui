#!/usr/bin/env node
// Runs the cyberstorm-remix dev server together with the build watchers for the
// three workspace packages that are consumed as built `dist` rather than source
// (they are excluded from preconstruct's source linking in the root
// package.json): @thunderstore/cyberstorm-theme, @thunderstore/cyberstorm and
// @thunderstore/ts-uploader.
//
// Editing the remix app reflects instantly via Vite HMR. Editing one of the
// three packages triggers its watcher to rebuild dist (~1-2s), which the remix
// dev server then hot-reloads. This replaces the old Docker + rsync setup.
//
// Usage: `yarn dev` (from the repo root).
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const isWindows = process.platform === "win32";

// Packages consumed as dist; each needs its watcher running for edits to show.
const DIST_PACKAGES = [
  {
    name: "@thunderstore/cyberstorm-theme",
    label: "theme",
    dist: "packages/cyberstorm-theme/dist",
    color: "36",
  },
  {
    name: "@thunderstore/cyberstorm",
    label: "cyberstorm",
    dist: "packages/cyberstorm/dist",
    color: "35",
  },
  {
    name: "@thunderstore/ts-uploader",
    label: "uploader",
    dist: "packages/ts-uploader/dist",
    color: "33",
  },
];

const children = new Set();
let shuttingDown = false;

// Kill the child AND its descendants. Each child is `shell:true` (a cmd.exe /
// /bin/sh wrapper around yarn -> node -> vite), so killing only the wrapper pid
// would orphan the real dev/watch processes (and leave port 3000 held). On
// Windows use `taskkill /T` to kill the tree; on POSIX the child is spawned
// detached as its own process-group leader, so kill the negative pid (the group).
function killTree(child) {
  if (!child.pid) return;
  try {
    if (isWindows) {
      spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], {
        stdio: "ignore",
      });
    } else {
      process.kill(-child.pid, "SIGINT");
    }
  } catch {
    // Process already gone; nothing to do.
  }
}

// Exit once every child's `exit` (or spawn-`error`) event has fired (the
// spawnChild handlers drain `children`) rather than after a fixed grace
// period — on a slow machine a fixed timer could return the prompt while
// taskkill/SIGINT is still mid-kill, leaving the trees briefly alive and
// port 3000 still bound for an immediate `yarn dev` restart. A generous
// deadline remains as a backstop for a tree that refuses to die.
function shutdown(code) {
  if (shuttingDown) return;
  shuttingDown = true;
  const finish = () => process.exit(code);
  if (children.size === 0) {
    finish();
    return;
  }
  const deadline = setTimeout(() => {
    try {
      process.stderr.write(
        "\nGave up waiting for child processes to exit; if port 3000 is " +
          "still in use, check for leftover node processes.\n"
      );
    } catch {
      // stderr may be unwritable; exit regardless.
    }
    finish();
  }, 5000);
  for (const child of children) {
    const checkDrain = () => {
      if (children.size === 0) {
        clearTimeout(deadline);
        finish();
      }
    };
    child.once("exit", checkDrain);
    child.once("error", checkDrain);
    killTree(child);
  }
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
// Backstop: never crash with a raw stack — shut the stack down cleanly
// instead, so the children (and port 3000) are not orphaned. Async bugs land
// on unhandledRejection; sync throws — and 'error' events on our own
// stdout/stderr, e.g. a broken pipe — on uncaughtException. (Child-stream
// errors never get here; pipeLines handles those without killing the stack.)
const onFatal = (err) => {
  try {
    process.stderr.write(`\nUnexpected error: ${err?.stack ?? err}\n`);
  } catch {
    // stderr itself may be unwritable; never let the backstop throw.
  }
  shutdown(1);
};
process.on("unhandledRejection", onFatal);
process.on("uncaughtException", onFatal);

function spawnChild(args, opts = {}) {
  const child = spawn("yarn", args, {
    cwd: root,
    shell: true,
    // Own process group on POSIX so killTree can take down the whole tree.
    detached: !isWindows,
    ...opts,
  });
  children.add(child);
  child.on("exit", () => children.delete(child));
  // A failed spawn emits `error` and never `exit`; drop the child here too so
  // it doesn't linger in `children` (callers add their own `error` handling).
  child.on("error", () => children.delete(child));
  return child;
}

// Run a command to completion (used for the one-off initial builds). Tracked in
// `children` so a Ctrl+C mid-build tears the build down too.
function build(name) {
  return new Promise((resolve_, reject) => {
    const child = spawnChild(["workspace", name, "build"], {
      stdio: "inherit",
    });
    // A failed spawn (e.g. yarn not on PATH) emits `error`, not `exit`; reject
    // so main()'s try/catch reports it and shuts the stack down cleanly.
    child.on("error", reject);
    child.on("exit", (code, signal) =>
      code === 0
        ? resolve_()
        : reject(
            new Error(
              `${name} build failed (${
                signal ? `signal ${signal}` : `exit ${code}`
              })`
            )
          )
    );
  });
}

// Forward a child stream to `out`, buffering by line so a prefix is never
// inserted mid-line when a log line straddles two `data` chunks.
function pipeLines(stream, prefix, out) {
  let buffer = "";
  stream.on("data", (data) => {
    buffer += data.toString();
    let newline;
    while ((newline = buffer.indexOf("\n")) !== -1) {
      const line = buffer.slice(0, newline).replace(/\r$/, "");
      out.write(`${prefix} ${line}\n`);
      buffer = buffer.slice(newline + 1);
    }
  });
  // Flush a trailing partial line on `end` (the standard EOF signal). `close`
  // is kept as a fallback for streams destroyed without reaching EOF; the
  // flush empties the buffer, so repeat firings write nothing twice.
  const flush = () => {
    if (!buffer.length) return;
    out.write(`${prefix} ${buffer.replace(/\r$/, "")}\n`);
    buffer = "";
  };
  stream.on("end", flush);
  stream.on("close", flush);
  // Without an 'error' listener a child-stream error would hit the
  // uncaughtException backstop and tear the whole stack down. Salvage what
  // was buffered and keep running instead; the child's own exit/error
  // handlers report the process outcome.
  stream.on("error", flush);
}

// Start a long-running command with a colored, line-prefixed log stream.
// `critical` processes (the remix server) bring the whole stack down if they
// exit; a watcher dying only logs a warning so the app server keeps running.
function start(name, { label, color, critical = false }) {
  const child = spawnChild(["workspace", name, "dev"]);
  const prefix = `\x1b[${color}m[${label}]\x1b[0m`;
  // stdout/stderr can be null when the spawn itself fails; the `error`
  // handler below reports that case.
  if (child.stdout) pipeLines(child.stdout, prefix, process.stdout);
  if (child.stderr) pipeLines(child.stderr, prefix, process.stderr);
  // A failed spawn emits `error` instead of `exit`. Without a handler Node
  // throws and crashes with a raw stack; treat it like the process exiting.
  child.on("error", (err) => {
    if (shuttingDown) return;
    process.stderr.write(`${prefix} failed to start: ${err.message}\n`);
    if (critical) {
      shutdown(1);
    } else {
      process.stderr.write(
        `${prefix} watcher could not start. Edits to ${name} won't rebuild ` +
          `until you restart \`yarn dev\`. Leaving the app server up.\n`
      );
    }
  });
  child.on("exit", (code, signal) => {
    if (shuttingDown) return;
    // On signal termination Node passes code=null and the signal separately.
    const cause = signal ? `signal ${signal}` : `code ${code}`;
    if (critical) {
      process.stderr.write(`${prefix} exited (${cause}); stopping all.\n`);
      shutdown(code ?? 1);
    } else {
      process.stderr.write(
        `${prefix} watcher exited (${cause}). Edits to ${name} won't ` +
          `rebuild until you restart \`yarn dev\`. Leaving the app server up.\n`
      );
    }
  });
}

async function main() {
  // 1. Ensure dist exists for the non-preconstruct packages (first run only).
  const missing = DIST_PACKAGES.filter(
    (p) => !existsSync(resolve(root, p.dist))
  );
  if (missing.length) {
    process.stdout.write(
      `Building workspace packages: ${missing
        .map((p) => p.label)
        .join(", ")}...\n`
    );
    try {
      for (const p of missing) {
        if (shuttingDown) return;
        await build(p.name);
      }
    } catch (err) {
      process.stderr.write(`\n${err.message}\nAborting dev startup.\n`);
      shutdown(1);
      return;
    }
  }
  if (shuttingDown) return;

  // 2. Start the package watchers (vite build --watch).
  for (const p of DIST_PACKAGES) {
    start(p.name, p);
  }

  // 3. Start the remix dev server (host/port come from vite.config.ts).
  start("@thunderstore/cyberstorm-remix", {
    label: "remix",
    color: "32",
    critical: true,
  });

  process.stdout.write(
    "\nStarting dev servers. Once the Thunderstore backend (docker) is up, open " +
      "\x1b[1mhttp://thunderstore.localhost\x1b[0m\n\n"
  );
}

main();
