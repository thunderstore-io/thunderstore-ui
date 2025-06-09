/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePathIgnorePatterns: [
    "<rootDir>/dist/",
    "<rootDir>/src/__tests__/defaultConfig.ts",
  ],
};
