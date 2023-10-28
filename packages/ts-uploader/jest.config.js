/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "./jestEnv.ts",
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
};
