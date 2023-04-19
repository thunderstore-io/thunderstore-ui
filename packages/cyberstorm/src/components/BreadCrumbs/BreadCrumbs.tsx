import React, { PropsWithChildren, ReactNode } from "react";

import { faHouse, faSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./BreadCrumbs.module.css";
import { IndexLink } from "../Links/Links";

type BreadCrumbsProps = PropsWithChildren<{
  excludeHome?: boolean;
}>;

type BreadCrumbProps = PropsWithChildren<{
  key?: number;
}>;

export function BreadCrumbs(props: BreadCrumbsProps) {
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
}

export function BreadCrumb(props: PropsWithChildren<BreadCrumbProps>) {
  const { key, children } = props;
  if (key) {
    return (
      <span key={key} className={styles.crumb}>
        {children}
      </span>
    );
  } else {
    return <span className={styles.crumb}>{children}</span>;
  }
}

export function Separator() {
  return (
    <FontAwesomeIcon
      aria-hidden
      fixedWidth
      className={styles.separator}
      icon={faSlash}
      rotation={90}
    />
  );
}

export function DefaultHomeCrumb() {
  return (
    <IndexLink>
      <FontAwesomeIcon fixedWidth icon={faHouse} className={styles.home} />
    </IndexLink>
  );
}
