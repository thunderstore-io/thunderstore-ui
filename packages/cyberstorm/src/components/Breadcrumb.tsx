import React, { PropsWithChildren, ReactNode } from "react";

import { faHouse, faSlashForward } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./componentStyles/Breadcrumb.module.css";
import { IndexLink } from "./Links";

type BreadcrumbsProps = PropsWithChildren<{
  excludeHome?: boolean;
}>;

export const Breadcrumbs: React.FC<BreadcrumbsProps> = (props) => {
  let nodes: ReactNode[] = !props.excludeHome ? [<DefaultHomeCrumb />] : [];
  nodes = [...nodes, ...React.Children.toArray(props.children)];
  nodes = ([] as ReactNode[])
    .concat(...nodes.map((x) => [x, <Separator />]))
    .slice(0, -1);
  return (
    <div className={styles.root}>
      {nodes.map((x, i) => (
        <Breadcrumb key={i}>{x}</Breadcrumb>
      ))}
    </div>
  );
};

export const Breadcrumb: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return <span className={styles.crumb}>{children}</span>;
};

export const Separator: React.FC = () => (
  <FontAwesomeIcon aria-hidden fixedWidth icon={faSlashForward} />
);

export const DefaultHomeCrumb: React.FC = () => {
  return (
    <IndexLink>
      <FontAwesomeIcon fixedWidth icon={faHouse} className={styles.home} />
    </IndexLink>
  );
};
