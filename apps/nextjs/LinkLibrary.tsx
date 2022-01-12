/**
 * Define how links should be rendered in @thunderstore/nextjs.
 *
 * Links included in @thunderstore/components are defined in the
 * LinkLibrary interface. Since @thunderstore/components aims to be
 * implmentation-agnostic, it doesn't know how they should be rendered.
 * It's up the app to define the rendering methods and provide them via
 * a context provider.
 *
 * To be consistent, it's not a bad idea to render the links defifned in
 * @thunderstore/nextjs with the same Link component defined here.
 */
import {
  Link as ChakraLink,
  LinkProps as ChakraLinkProps,
} from "@chakra-ui/react";
import {
  LinkLibrary,
  thunderstoreLinkProps,
  ThunderstoreLinkProps,
} from "@thunderstore/components";
import NextLink from "next/link";

interface LinkProps extends ChakraLinkProps, ThunderstoreLinkProps {
  queryParams?: string;
  url: string;
}

export const Link = (props: LinkProps): React.ReactElement => {
  const { children, queryParams, url, ...chakraProps } = props;
  const q = queryParams ? `?${queryParams}` : "";

  for (const key in thunderstoreLinkProps) {
    delete chakraProps[key as keyof ThunderstoreLinkProps];
  }

  return (
    <NextLink href={`${url}${q}`} passHref>
      <ChakraLink {...chakraProps}>{children}</ChakraLink>
    </NextLink>
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
  Team: (p) => Link({ ...p, url: `/team/${p.team}/` }),
};

export { library as LinkLibrary };
