import { Flex, Heading, Text } from "@chakra-ui/react";
import React, { Fragment } from "react";

import { Raquo } from "./Icons";

interface Crumb {
  label: string;
  LinkComponent?: (props: any) => React.ReactElement | null; // eslint-disable-line @typescript-eslint/no-explicit-any
  LinkProps?: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface Props {
  parts: Crumb[];
}

/**
 * Navigational bread crumbs defining where the user is at the site.
 */
export const BreadCrumbs: React.FC<Props> = (props) => {
  const parts = [...props.parts];
  const root = parts.shift();
  const leaf = parts.pop();

  if (root === undefined) {
    return null;
  }

  return (
    <Flex align="center" h="100px">
      <RootCrumb crumb={root} />
      {(parts.length || leaf !== undefined) && <Separator />}

      {parts.map((crumb, i) => (
        <Fragment key={`${crumb.label}-${i}`}>
          <MidCrumb crumb={crumb} />
          <Separator />
        </Fragment>
      ))}

      <LeafCrumb crumb={leaf} />
    </Flex>
  );
};

const RootCrumb: React.FC<{ crumb?: Crumb }> = (props) => {
  const { crumb } = props;

  if (crumb === undefined) {
    return null;
  }

  const heading = (
    <Heading fontSize={30} fontWeight={900}>
      {crumb.label}
    </Heading>
  );

  if (crumb.LinkComponent === undefined) {
    return heading;
  }

  return (
    <crumb.LinkComponent {...crumb.LinkProps} _hover={hoverStyles}>
      {heading}
    </crumb.LinkComponent>
  );
};

const MidCrumb: React.FC<{ crumb: Crumb }> = (props) => {
  const { crumb } = props;

  if (crumb.LinkComponent === undefined) {
    return <TextLabel label={crumb.label} />;
  }

  return (
    <crumb.LinkComponent
      {...crumb.LinkProps}
      _hover={{ ...hoverStyles, textDecorationThickness: "2px" }}
    >
      <TextLabel label={crumb.label} />
    </crumb.LinkComponent>
  );
};

const LeafCrumb: React.FC<{ crumb?: Crumb }> = (props) => {
  const { crumb } = props;
  return crumb === undefined ? null : <TextLabel label={crumb.label} />;
};

const TextLabel: React.FC<{ label: string }> = (props) => {
  return (
    <Text color="ts.white" fontSize={26} fontWeight={700} opacity="0.7">
      {props.label}
    </Text>
  );
};

const Separator = () => (
  <Raquo boxSize="20px" color="ts.white" m="8px 20px 0 20px" opacity="0.7" />
);

const hoverStyles = {
  textDecorationColor: "ts.white",
  textDecorationLine: "underline",
  textDecorationStyle: "solid",
  textDecorationThickness: "3px",
};
