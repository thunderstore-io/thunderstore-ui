import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCheckSquare,
  faCoffee,
  faSkull,
} from "@fortawesome/free-solid-svg-icons";

library.add(faCheckSquare, faCoffee, faSkull);

export interface IconProps {
  iconName: string;
}

/**
 * FontAwesome Icon Component.
 */
export const Icon: React.FC<IconProps> = (props) => {
  const { iconName } = props;

  return <FontAwesomeIcon icon={["fas", iconName]} />;
};
