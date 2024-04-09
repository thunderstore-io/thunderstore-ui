import fs from "fs";
import readline from "readline";
import * as child_process from "child_process";
import * as promisify from "util";
import {
  getGrepLogPathForVariable,
  VARIABLE_REPLACEMENT_MAP,
} from "./variables";

const exec_async = promisify.promisify(child_process.exec);

async function loadMatchesForVariable(variableName: string): Promise<string[]> {
  /**
   * Returns a list of file paths where this variable was found at build time.
   */
  const grepLogStream = readline.createInterface({
    input: fs.createReadStream(getGrepLogPathForVariable(variableName)),
    crlfDelay: Infinity,
  });
  const result: string[] = [];
  for await (const line of grepLogStream) {
    const filename = line.split(":")[0];
    if (result.indexOf(filename) < 0) {
      result.push(filename);
    }
  }
  return result;
}

async function replaceAllInFile(
  filepath: string,
  searchFor: string,
  replaceWith: string
) {
  await exec_async(`sed -i 's/${searchFor}/${replaceWith}/g' ${filepath}`);
}

async function processVariable(variableName: string, searchTarget: string) {
  const newValue = process.env[variableName];
  if (!newValue) {
    console.warn(
      `Skipping replacement for ${variableName} as no value was found in environment`
    );
    return;
  }
  const filePaths = await loadMatchesForVariable(variableName);
  for (const filePath of filePaths) {
    await replaceAllInFile(filePath, searchTarget, newValue);
  }
}

async function run() {
  console.log("Replacing environment variables in prebuilt files...");
  for (const [variableName, searchTarget] of Object.entries(
    VARIABLE_REPLACEMENT_MAP
  )) {
    console.log(`Patching ${variableName}`);
    await processVariable(variableName, searchTarget);
  }
}

run();
