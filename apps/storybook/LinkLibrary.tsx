/* eslint-disable prettier/prettier */
import {
  Link as ChakraLink,
  LinkProps as ChakraLinkProps,
} from "@chakra-ui/react";
import {
  LinkLibrary,
  thunderstoreLinkProps,
  ThunderstoreLinkProps,
} from "@thunderstore/components";

interface LinkProps extends ChakraLinkProps, ThunderstoreLinkProps {
  url: string;
}

const Link = (props: LinkProps): React.ReactElement => {
  const { url, children, ...chakraProps } = props;

  for (const key in thunderstoreLinkProps) {
    delete chakraProps[key as keyof ThunderstoreLinkProps];
  }

  // Render links as spans so clicking them does nothing.
  return (
    <ChakraLink href={url} {...chakraProps} as="span">
      {children}
    </ChakraLink>
  );
};

const library: LinkLibrary = {
  Anonymous: (p) => Link(p),
  Communities: (p) => Link({ ...p, url: "/communities/" }),
  Community: (p) => Link({ ...p, url: `/c/${p.community}/` }),
  CommunityPackages: (p) => Link({ ...p, url: `/c/${p.community}/packages/` }),
  Index: (p) => Link({ ...p, url: "/" }),
  Package: (p) => Link({ ...p, url: `/c/${p.community}/p/${p.package}/` }),
  PackageUpload: (p) => Link({ ...p, url: "/packages/new/" }),
  PackageDependants: (p) =>
    Link({ ...p, url: `/c/${p.community}/p/${p.package}/dependants/` }),
  Team: (p) => Link({ ...p, url: `/team/${p.team}/` }),
};

export { library as LinkLibrary };
