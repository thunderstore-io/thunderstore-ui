/**
 * Client-side, pre-upload inspection of a package ZIP that surfaces common
 * mistakes before the file is sent to the server. Ported from the legacy
 * Django upload page (`Thunderstore/builder/src/uploadZipValidation.ts`).
 *
 * `warnings` are advisory (the upload is still allowed); `errors` are blocking
 * problems that should prevent submission. Only entry filenames are inspected,
 * never file contents — see {@link ./readZipFilenames}.
 */
import { readZipFilenames } from "./readZipFilenames";

export interface PackageZipValidation {
  /** Advisory notices; do not block submission. */
  warnings: string[];
  /** Blocking problems; submission should be prevented while present. */
  errors: string[];
}

const TEST_IN_NAME_WARNING =
  "If you need to test your mod, you can import it locally through the 'Import local mod' option in your mod manager's settings.";
const BEPINEX_WARNING =
  "You have BepInEx.dll in your .zip file. BepInEx should probably be a dependency in your manifest.json file instead.";
const ASSEMBLY_CSHARP_WARNING =
  "You have Assembly-CSharp.dll in your .zip file. Your package may be removed if you do not have permission to distribute this file.";
const MODPACK_WARNING =
  "If you're making a modpack, do not include the files for each mod in your .zip file. Instead, put the dependency string for each mod inside your manifest.json file.";
const WRONG_CASE_ERROR =
  "The file names of manifest.json, icon.png, and README.md are case-sensitive.";
const WRONG_EXTENSION_ERROR =
  "Your manifest.json, icon.png, and README.md files must have the correct file extensions.";
const NOT_AT_ROOT_ERROR =
  "Your manifest, icon, and README files should be at the root of the .zip file. You can prevent this by compressing the contents of a folder, rather than the folder itself.";
const MISSING_EXTENSION_ERROR =
  "Your manifest.json, icon.png, or README.md file is missing its file extension.";
const MISSING_MANIFEST_ERROR = "Your package is missing a manifest.json file!";
const MISSING_ICON_ERROR = "Your package is missing an icon.png file!";
const MISSING_README_ERROR = "Your package is missing a README.md file!";

/**
 * Applies the package-content rules to a ZIP's entry filenames.
 *
 * `entryNames` is `null` when the archive couldn't be analysed; in that case
 * only filename-based warnings are produced and no blocking errors are raised,
 * leaving authoritative validation to the server.
 */
export function evaluateZipContents(
  fileName: string,
  entryNames: string[] | null
): PackageZipValidation {
  const warnings: string[] = [];
  const errors: string[] = [];

  if (fileName.toLowerCase().includes("test")) {
    warnings.push(TEST_IN_NAME_WARNING);
  }

  if (entryNames === null) {
    return { warnings, errors };
  }

  let dllCount = 0;
  let hasBepInEx = false;
  let hasAssemblyCSharp = false;
  let maybeModpack = false;
  let hasManifest = false;
  let rootManifest = false;
  let hasIcon = false;
  let rootIcon = false;
  let hasReadMe = false;
  let rootReadMe = false;
  let wrongCase = false;
  let wrongExtension = false;
  let noExtension = false;

  for (const filename of entryNames) {
    const lower = filename.toLowerCase();
    // Inspect the leaf name (and whether it sits at the archive root) so the
    // checks work regardless of folder nesting, e.g. "MyMod/manifest.json".
    const leaf = filename.split("/").pop() ?? "";
    const leafLower = leaf.toLowerCase();
    const atRoot = !filename.includes("/");

    if (lower.endsWith(".dll")) {
      dllCount++;
    }
    if (leafLower === "assembly-csharp.dll") {
      hasAssemblyCSharp = true;
    }
    if (leafLower === "bepinex.dll") {
      hasBepInEx = true;
      maybeModpack = true;
    }

    if (leafLower === "manifest.json") {
      hasManifest = true;
      if (atRoot) {
        rootManifest = true;
      }
      if (leaf !== "manifest.json") {
        wrongCase = true;
      }
    }
    if (leafLower === "icon.png") {
      hasIcon = true;
      if (atRoot) {
        rootIcon = true;
      }
      if (leaf !== "icon.png") {
        wrongCase = true;
      }
    }
    if (leafLower === "readme.md") {
      hasReadMe = true;
      if (atRoot) {
        rootReadMe = true;
      }
      if (leaf !== "README.md") {
        wrongCase = true;
      }
    }

    if (
      leafLower === "readme.txt" ||
      leafLower === "manifest.txt" ||
      leafLower === "icon.jpg" ||
      leafLower === "icon.jpeg"
    ) {
      wrongExtension = true;
    }
    if (
      leafLower === "readme" ||
      leafLower === "manifest" ||
      leafLower === "icon"
    ) {
      noExtension = true;
    }
  }

  if (hasBepInEx) {
    warnings.push(BEPINEX_WARNING);
  }
  if (hasAssemblyCSharp) {
    warnings.push(ASSEMBLY_CSHARP_WARNING);
  }
  if (dllCount > 8) {
    warnings.push(
      `You have ${dllCount} .dll files in your .zip file. Some of these files may be unnecessary.`
    );
    maybeModpack = true;
  }
  if (maybeModpack) {
    warnings.push(MODPACK_WARNING);
  }

  if (wrongCase) {
    errors.push(WRONG_CASE_ERROR);
  }
  if (wrongExtension) {
    errors.push(WRONG_EXTENSION_ERROR);
  }

  // A required file is present but not at the archive root (e.g. the user
  // zipped the containing folder instead of its contents). Fire for ANY
  // misplaced required file, not only when all three are nested.
  if (
    (hasManifest && !rootManifest) ||
    (hasIcon && !rootIcon) ||
    (hasReadMe && !rootReadMe)
  ) {
    errors.push(NOT_AT_ROOT_ERROR);
  }

  if ((!hasManifest || !hasIcon || !hasReadMe) && noExtension) {
    errors.push(MISSING_EXTENSION_ERROR);
  }
  if (!hasManifest) {
    errors.push(MISSING_MANIFEST_ERROR);
  }
  if (!hasIcon) {
    errors.push(MISSING_ICON_ERROR);
  }
  if (!hasReadMe) {
    errors.push(MISSING_README_ERROR);
  }

  return { warnings, errors };
}

/**
 * Inspects a selected package ZIP and returns advisory warnings and blocking
 * errors. Never rejects — an unreadable archive yields no blocking errors so
 * the server remains the source of truth.
 */
export async function validatePackageZip(
  file: File
): Promise<PackageZipValidation> {
  const entryNames = await readZipFilenames(file);
  return evaluateZipContents(file.name, entryNames);
}
