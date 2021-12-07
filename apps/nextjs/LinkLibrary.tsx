/**
 * TODO: describe what this is all about.
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
  url: string;
}

const Link = (props: LinkProps): React.ReactElement => {
  const { url, children, ...chakraProps } = props;

  for (const key in thunderstoreLinkProps) {
    delete chakraProps[key as keyof ThunderstoreLinkProps];
  }

  return (
    <NextLink href={url}>
      <ChakraLink href={url} {...chakraProps}>
        {children}
      </ChakraLink>
    </NextLink>
  );
};

const library: LinkLibrary = {
  Anonymous: (p) => Link(p),
  Index: (p) => Link({ ...p, url: "/" }),
  Package: (p) => Link({ ...p, url: `/c/${p.community}/p/${p.package}` }),
};

export { library as LinkLibrary };
