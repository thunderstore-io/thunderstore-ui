// A map of strings to replace in the built files.
//   - key: name of the environment variable to use as a replacement when replacing
//   - value: the actual string to be searched for & replaced
// NOTE: The search target or replacement value should not contain quotes or escape
//       characters as the pipeline does not handle them properly.
export const VARIABLE_REPLACEMENT_MAP = {
  PUBLIC_CONFIG: "eyJjb25maWciOiAicGxhY2Vob2xkZXIifQ==",
};

export function getGrepLogPathForVariable(variableName: string): string {
  return `./${variableName}.locations`;
}
