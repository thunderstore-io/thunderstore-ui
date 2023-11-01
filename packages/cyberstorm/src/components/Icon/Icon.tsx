"use client";
import { Children, cloneElement } from "react";
import styles from "./Icon.module.css";
import { classnames } from "../../utils/utils";

interface IconProps {
  children?: JSX.Element | JSX.Element[];
  noWrapper?: boolean;
  inline?: boolean;
  iconClasses?: string;
  wrapperClasses?: string;
}

export function Icon(props: IconProps) {
  const {
    children,
    noWrapper = false,
    inline = false,
    iconClasses,
    wrapperClasses,
  } = props;
  if (!children) {
    return null;
  }
  const clones = Children.map(children, (child) =>
    cloneElement(child, {
      className: classnames(
        child.props.className,
        styles.root,
        inline ? styles.inline : null,
        iconClasses ? iconClasses : null
      ),
    })
  );
  return noWrapper ? (
    <>{clones}</>
  ) : inline ? (
    <span className={wrapperClasses}>{clones}</span>
  ) : (
    <div className={wrapperClasses}>{clones}</div>
  );
}

Icon.displayName = "Icon";
