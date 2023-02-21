import React, { PropsWithChildren, ReactNode } from "react";

import { faHouse, faSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./BreadCrumbs.module.css";
import { IndexLink } from "../Links/Links";

type BreadCrumbsProps = PropsWithChildren<{
  excludeHome?: boolean;
}>;

export const BreadCrumbs: React.FC<BreadCrumbsProps> = (props) => {
  let nodes: ReactNode[] = !props.excludeHome ? [<DefaultHomeCrumb />] : [];
  nodes = [...nodes, ...React.Children.toArray(props.children)];
  nodes = ([] as ReactNode[])
    .concat(...nodes.map((x) => [x, <Separator />]))
    .slice(0, -1);
  return (
    <div className={styles.root}>
      {nodes.map((x, i) => (
        <BreadCrumb key={i}>{x}</BreadCrumb>
      ))}
    </div>
  );
};

export const BreadCrumb: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return <span className={styles.crumb}>{children}</span>;
};

export const Separator: React.FC = () => (
  <FontAwesomeIcon
    aria-hidden
    fixedWidth
    className={styles.separator}
    icon={faSlash}
    rotation={90}
  />
);

export const DefaultHomeCrumb: React.FC = () => {
  return (
    <IndexLink>
      <FontAwesomeIcon fixedWidth icon={faHouse} className={styles.home} />
    </IndexLink>
  );
};
