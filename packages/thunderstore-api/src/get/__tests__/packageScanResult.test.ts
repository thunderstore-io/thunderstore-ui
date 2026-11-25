import { expect, test } from "vitest";

import { packageScanResultResponseDataSchema } from "../../schemas/responseSchemas";

const scanned = {
  namespace: "Test_Team_0",
  package_name: "Test_Package_0",
  scan_result: {
    version_number: "1.0.0",
    datetime_created: "2026-11-20T19:13:42.435604Z",
    context: ["example context line"],
    findings: { "example.txt": ["first finding", "second finding"] },
  },
};

test("accepts a scan result with findings", () => {
  expect(packageScanResultResponseDataSchema.parse(scanned)).toEqual(scanned);
});

test("accepts a clean scan result", () => {
  const clean = {
    ...scanned,
    scan_result: {
      version_number: "1.0.0",
      datetime_created: "2026-11-20T19:13:42.435604Z",
      context: [],
      findings: {},
    },
  };

  expect(packageScanResultResponseDataSchema.parse(clean)).toEqual(clean);
});

test("accepts a package that was never scanned", () => {
  const neverScanned = { ...scanned, scan_result: null };

  expect(packageScanResultResponseDataSchema.parse(neverScanned)).toEqual(
    neverScanned
  );
});
