import * as fs from "fs";
import path from "path";

/**
 * @param {string} packagePath
 * @returns {Promise<string>}
 */
async function readPackageName(packagePath) {
  const manifestRaw = await fs.promises.readFile(packagePath);
  const manifest = JSON.parse(manifestRaw);
  return manifest.name;
}

/**
 * @param {string} basePath
 * @returns {Promise<string[]>}
 */
async function getLocalPackages(basePath) {
  /** @type {Dirent[]} */
  const entries = await fs.promises.readdir("./packages", {
    withFileTypes: true,
  });
  const directories = entries.filter((x) => x.isDirectory());

  const packages = directories.map((dir) => {
    const packagePath = path.join(basePath, dir.name, "package.json");
    return readPackageName(packagePath);
  });

  return (await Promise.allSettled(packages))
    .filter((x) => x.status == "fulfilled")
    .map((x) => x.value);
}

/**
 * Returns undefined if validation passes or an error message if it fails.
 * @param {string} val
 * @returns {undefined|string}
 */
function validateRequired(val) {
  const trimmed = val.trim();

  if (val && trimmed === val) {
    // TODO: Validate characters
    return undefined;
  } else {
    return "The field is required";
  }
}

/**
 * @param {import("plop").NodePlopAPI} plop
 */
export default async function (plop) {
  const localPackages = await getLocalPackages("./packages");
  const localPackageChoices = localPackages.map((x) => ({
    name: x,
    value: x,
  }));

  plop.setGenerator("package", {
    description: "Create a new package",
    prompts: [
      {
        type: "input",
        name: "name",
        message:
          "Name of the package (without namespace prefix). Example: 'dapper'",
      },
      {
        type: "input",
        name: "description",
        message: "Description for the package",
      },
      {
        type: "input",
        name: "version",
        message: "Version of the package",
        default: "0.1.0",
      },
      {
        type: "confirm",
        name: "isReact",
        message: "Are you creating a React library?",
        default: false,
      },
      {
        type: "checkbox",
        name: "dependencies",
        message:
          "Does the package depend on any others from this repo? (Select all)",
        choices: localPackageChoices,
      },
    ],
    actions: [
      {
        type: "addMany",
        base: "./plop/package",
        templateFiles: "./plop/package/**/*.hbs",
        destination: "./packages/{{kebabCase name}}",
      },
    ],
  });
}
