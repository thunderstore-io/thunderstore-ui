import fs from "fs";
import * as child_process from "child_process";

const variablesToReplace = {
  CYBERSTORM_REPLACE_NEXT_PUBLIC_ROOT_DOMAIN:
    process.env.NEXT_PUBLIC_ROOT_DOMAIN,
  CYBERSTORM_REPLACE_NEXT_PUBLIC_API_DOMAIN: process.env.NEXT_PUBLIC_API_DOMAIN,
  CYBERSTORM_REPLACE_NEXT_PUBLIC_AUTH_BASE_URL:
    process.env.NEXT_PUBLIC_AUTH_BASE_URL,
  CYBERSTORM_REPLACE_NEXT_PUBLIC_AUTH_RETURN_URL:
    process.env.NEXT_PUBLIC_AUTH_RETURN_URL,
};

function grepWithShell(log_file_stream: fs.WriteStream, variable: string) {
  const spawn = child_process.spawn;
  const grep = spawn("grep", ["-RHn", variable, ".next/"]);
  const cut = spawn("cut", ["-d:", "-f-2"]);
  grep.stdout.pipe(cut.stdin);
  cut.stdout.pipe(log_file_stream);
}

console.log("Storing locations of env variables");
for (const key in variablesToReplace) {
  const log_file_stream = fs.createWriteStream(`./${key}.locations`, {
    flags: "a",
  });
  grepWithShell(log_file_stream, key);
}
