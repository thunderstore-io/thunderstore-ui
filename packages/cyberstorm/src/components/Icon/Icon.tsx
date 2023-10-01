"use client";
import { Children, cloneElement } from "react";
import styles from "./Icon.module.css";

interface IconProps {
  children?: JSX.Element | JSX.Element[];
}

export function Icon(props: IconProps) {
  const { children } = props;
  if (!children) {
    return null;
  }
  const clones = Children.map(children, (child) =>
    cloneElement(child, {
      className: `${child.props.className} ${styles.root}`,
    })
  );
  return <>{clones}</>;
}

Icon.displayName = "Icon";
