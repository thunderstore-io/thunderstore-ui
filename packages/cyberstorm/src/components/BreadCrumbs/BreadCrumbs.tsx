import React, { PropsWithChildren, ReactNode } from "react";

import { faHouse, faSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./BreadCrumbs.module.css";
import { IndexLink } from "../Links/Links";

type BreadCrumbsProps = PropsWithChildren<{
  excludeHome?: boolean;
}>;

export const BreadCrumbs: React.FC<BreadCrumbsProps> = (props) => {
  const nodes: ReactNode[] = [
    !props.excludeHome ? <DefaultHomeCrumb key={0} /> : null,
  ];

  React.Children.toArray(props.children).forEach((node) => {
    nodes.push(<Separator />);
    nodes.push(node);
  });

  return (
    <div className={styles.root}>
      {nodes.map((x, i) => (
        <BreadCrumb key={i}>{x}</BreadCrumb>
      ))}
    </div>
  );
};

export const BreadCrumb: React.FC<PropsWithChildren<ReactNode>> = ({
  children,
}) => {
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
