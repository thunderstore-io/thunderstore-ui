import fs from "fs";
import Path from "path";

/**
 * We're doing this because the docker image is not built with production environments variables.
 * And NextJS doesn't support "build-on-demand" (yet).
 */
const variablesToReplace = {
  CYBERSTORM_REPLACE_NEXT_PUBLIC_ROOT_DOMAIN:
    process.env.NEXT_PUBLIC_ROOT_DOMAIN,
  CYBERSTORM_REPLACE_NEXT_PUBLIC_API_DOMAIN: process.env.NEXT_PUBLIC_API_DOMAIN,
  CYBERSTORM_REPLACE_NEXT_PUBLIC_AUTH_BASE_URL:
    process.env.NEXT_PUBLIC_AUTH_BASE_URL,
  CYBERSTORM_REPLACE_NEXT_PUBLIC_AUTH_RETURN_URL:
    process.env.NEXT_PUBLIC_AUTH_RETURN_URL,
};

function iterateFiles(buildRootDir: string) {
  fs.readdirSync(buildRootDir).forEach((File) => {
    const filePath = Path.join(buildRootDir, File);
    if (fs.statSync(filePath).isDirectory()) return iterateFiles(filePath);
    else return findAndReplaceInFile(filePath);
  });
}

async function findAndReplaceInFile(filePath: string) {
  fs.readFile(filePath, "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }

    var result = data;
    for (const key in variablesToReplace) {
      const newValue =
        variablesToReplace[key as keyof typeof variablesToReplace];
      if (newValue) {
        result = result.replace(new RegExp(key, "g"), newValue);
      }
    }

    fs.writeFile(filePath, result, "utf8", function (err) {
      if (err) return console.log(err);
    });
  });
}
console.log("Replacing built public environment variables");
iterateFiles(process.argv[2]);
console.log("Done!");
