import fs from "fs";
import * as child_process from "child_process";
import {
  getGrepLogPathForVariable,
  VARIABLE_REPLACEMENT_MAP,
} from "./variables";

function grepWithShell(logStream: fs.WriteStream, searchFor: string) {
  const spawn = child_process.spawn;
  const grep = spawn("grep", ["-RHn", searchFor, ".next/"]);
  const cut = spawn("cut", ["-d:", "-f-2"]);
  grep.stdout.pipe(cut.stdin);
  cut.stdout.pipe(logStream);
}

console.log("Storing locations of variable values which need replacing...");
for (const [name, searchTarget] of Object.entries(VARIABLE_REPLACEMENT_MAP)) {
  const logStream = fs.createWriteStream(getGrepLogPathForVariable(name), {
    flags: "a",
  });
  grepWithShell(logStream, searchTarget);
}
console.log("Done!");
