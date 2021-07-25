import { setOutput, setFailed, getInput } from "@actions/core";
import semver from "semver";
import {readFileSync} from "fs";

(() => {
  const inputPath = getInput("package-json");

  if (!inputPath) {
    setFailed("No `package.json` path provided");
  }

  const rawContent = readFileSync(inputPath);
  const packageJson = JSON.parse(rawContent.toString());

  // Check if both ranges are valid
  const engineVersionRangeString = semver.validRange(packageJson.engines.node);
  if (!engineVersionRangeString) {
    setFailed(`Invalid engine version range: ${engineVersionRangeString}`);
    return;
  }

  const typesVersionRangeString = semver.validRange(
    packageJson.devDependencies["@types/node"]
  );
  if (!typesVersionRangeString) {
    setFailed(`Invalid types version range: ${typesVersionRangeString}`);
    return;
  }

  // Check if version are compatible
  const engineVersionRangeMinimum = semver.minVersion(engineVersionRangeString);
  if (!engineVersionRangeMinimum) {
    setFailed(`Invalid engine version range: ${engineVersionRangeString}`);
    return;
  }

  const typesVersionRangeMinimum = semver.minVersion(typesVersionRangeString);
  if (!typesVersionRangeMinimum) {
    setFailed(`Invalid engine version range: ${typesVersionRangeString}`);
    return;
  }

  if (
    engineVersionRangeMinimum.major !== typesVersionRangeMinimum.major ||
    typesVersionRangeMinimum.minor > engineVersionRangeMinimum.minor
  ) {
    setFailed(`Engine version range is incompatible with types version range`);
    return;
  }

  setOutput("node-version", engineVersionRangeMinimum.major);
})();
