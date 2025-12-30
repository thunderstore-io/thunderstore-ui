import { formatToDisplayName } from "@thunderstore/cyberstorm";
import { getPublicEnvVariables } from "cyberstorm/security/publicEnvVariables";

type PackageMetaTagsProps = {
  packageName: string;
  packageDescription: string;
  communityName: string;
  pathname: string;
  namespace: string;
  iconUrl?: string;
};

export function PackageMetaTags({
  packageName,
  packageDescription,
  communityName,
  pathname,
  namespace,
  iconUrl,
}: PackageMetaTagsProps) {
  return (
    <>
      <meta
        title={`${formatToDisplayName(
          packageName
        )} | Thunderstore - The ${communityName} Mod Database`}
      />
      <meta name="description" content={packageDescription} />
      <meta property="og:type" content="website" />
      <meta
        property="og:url"
        content={`${getPublicEnvVariables(["VITE_BETA_SITE_URL"])}${pathname}`}
      />
      <meta
        property="og:title"
        content={`${formatToDisplayName(packageName)} by ${namespace}`}
      />
      <meta property="og:description" content={packageDescription} />
      <meta property="og:image:width" content="256" />
      <meta property="og:image:height" content="256" />
      <meta property="og:image" content={iconUrl ?? undefined} />
      <meta property="og:site_name" content="Thunderstore" />
    </>
  );
}
