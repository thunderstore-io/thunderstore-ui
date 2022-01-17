import { Box, chakra, Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";

import { DownloadLinkIcon, InstallIcon } from "./Icons";
import { PackageDownloadLink, PackageInstallLink } from "./Links";
import { RelativeTime } from "./RelativeTime";

export interface PackageVersion {
  downloadCount: number;
  uploaded: string;
  version: string;
}

interface PackageVersionsProps {
  packageName: string;
  packageNamespace: string;
  versions: PackageVersion[];
}

/**
 * Render list of different versions available for a package.
 */
export const PackageVersions: React.FC<PackageVersionsProps> = (props) => {
  const { packageName: name, packageNamespace: namespace, versions } = props;

  if (!versions.length) {
    return null;
  }

  const [latest, ...rest] = versions;
  const pkgProps = { name, namespace };

  return (
    <Box>
      <Heading as="h3" variant="ts.subtle" mb="20px">
        Available Versions
      </Heading>

      <Version version={latest} {...pkgProps} isLatest />

      {rest.length > 0 && (
        <chakra.hr borderColor="ts.lightBlue" borderWidth="1px" mb="20px" />
      )}

      {rest.map((ver) => (
        <Version key={ver.version} version={ver} {...pkgProps} />
      ))}
    </Box>
  );
};

interface VersionProps {
  isLatest?: boolean;
  name: string;
  namespace: string;
  version: PackageVersion;
}

const Version: React.FC<VersionProps> = (props) => {
  const { isLatest, name, namespace, version } = props;
  const { downloadCount, uploaded, version: ver } = version;

  return (
    <Flex mb="20px" color="ts.coolGray">
      <Box flex="1 1 auto" isTruncated>
        <Heading
          as="h4"
          isTruncated
          size="sm"
          title={version.version}
          color={isLatest ? "ts.orange" : "ts.babyBlue"}
        >
          Version {version.version}
        </Heading>

        <Text isTruncated my="5px">
          Downloads:
          <Span>{downloadCount}</Span>
        </Text>

        <Text isTruncated>
          Upload date:
          <Span>
            <RelativeTime time={uploaded} as="span" />
          </Span>
        </Text>
      </Box>

      <Flex align="center" columnGap="20px" flex="0 0 88px" justify="end">
        <PackageInstallLink
          namespace={namespace}
          package={name}
          version={ver}
          title={`Install ${name} v${ver}`}
        >
          <InstallIcon boxSize="24px" color="ts.babyBlue" />
        </PackageInstallLink>

        <PackageDownloadLink
          namespace={namespace}
          package={name}
          version={ver}
          title={`Download ${name} v${ver}`}
        >
          <DownloadLinkIcon boxSize="24px" color="ts.babyBlue" />
        </PackageDownloadLink>
      </Flex>
    </Flex>
  );
};

const Span: React.FC = (props) => (
  <chakra.span color="ts.babyBlue" fontWeight={600} ml="16px">
    {props.children}
  </chakra.span>
);
