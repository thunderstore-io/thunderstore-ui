/**
 * TODO: describe what this is all about.
 */
import {
  Link as ChakraLink,
  LinkProps as ChakraLinkProps,
} from "@chakra-ui/react";
import {
  LinkLibrary,
  UrlTemplate as url,
  UrlTemplateType,
} from "@thunderstore/components";
import NextLink from "next/link";

interface ExternalLinkProps extends ChakraLinkProps {
  urlParams?: string[];
}

interface InternalLinkProps extends ExternalLinkProps {
  urlTemplate: UrlTemplateType;
}

const Link = (props: InternalLinkProps): React.ReactElement => {
  const { urlTemplate, urlParams, children, ...chakraProps } = props;
  const to = urlTemplate(...(urlParams ?? []));

  return (
    <NextLink href={to}>
      <ChakraLink href={to} {...chakraProps}>
        {children}
      </ChakraLink>
    </NextLink>
  );
};

Link.defaultProps = {
  urlParams: [],
};

type ELP = React.FC<ExternalLinkProps>;
const Anonymous: ELP = (p) => Link({ ...p, urlTemplate: url`${0}` });
const Index: ELP = (p) => Link({ ...p, urlTemplate: url`/` });
const Package: ELP = (p) => Link({ ...p, urlTemplate: url`/c/${0}/p/${1}` });

const library: LinkLibrary = {
  Anonymous,
  Index,
  Package,
};

export { library as LinkLibrary };
