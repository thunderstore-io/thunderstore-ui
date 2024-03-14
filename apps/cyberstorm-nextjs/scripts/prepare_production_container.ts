import fs from "fs";
import readline from "readline";
import * as child_process from "child_process";
import * as promisify from "util";

const exec_async = promisify.promisify(child_process.exec);

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

interface LocationsMap {
  // File Path
  [key: string]: {
    // Env var key
    [key: string]: string[]; // List of lines
  };
}

const locations = {} as LocationsMap;

async function storeLocations(fileStream: fs.ReadStream, key: string) {
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const splitsplat = line.split(":");

    if (!(splitsplat[0] in locations)) {
      locations[splitsplat[0]] = {};
    }

    if (!(key in locations[splitsplat[0]])) {
      locations[splitsplat[0]][key] = [];
    }

    locations[splitsplat[0]][key].push(splitsplat[1]);
  }
}

async function doReplace() {
  for (const key in variablesToReplace) {
    const newValue = variablesToReplace[key as keyof typeof variablesToReplace];
    if (newValue) {
      const fileStream = fs.createReadStream(`${key}.locations`);
      await storeLocations(fileStream, key);
    }
  }
  for (const filePath in locations) {
    const sedArgs = [];
    for (const key in variablesToReplace) {
      if (key in locations[filePath]) {
        for (const line in locations[filePath][key]) {
          sedArgs.push("-e");
          sedArgs.push(
            `'${locations[filePath][key][line]}s/${key}/${variablesToReplace[
              key as keyof typeof variablesToReplace
            ]?.replaceAll("/", "\\/")}/g'`
          );
        }
      }
    }
    const sedCommand = "sed -i " + sedArgs.join(" ") + " " + filePath;
    await exec_async(sedCommand).catch((err) => {
      console.log(err);
    });
  }
}

console.log("Replacing built public environment variables");
doReplace();
