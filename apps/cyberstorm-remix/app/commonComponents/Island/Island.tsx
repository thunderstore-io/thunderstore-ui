import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import { classnames } from "@thunderstore/cyberstorm";

import "./Island.css";

type IslandOwnProps<T extends ElementType = "div"> = {
  as?: T;
  children: ReactNode;
  level?: "1" | "2";
  variant?: "special";
  rootClasses?: string;
};

export type IslandProps<T extends ElementType = "div"> = IslandOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof IslandOwnProps<T> | "className">;

export function Island<T extends ElementType = "div">({
  as,
  children,
  level = "1",
  variant,
  rootClasses,
  ...rest
}: IslandProps<T>) {
  const Component = (as ?? "div") as ElementType;

  return (
    <Component
      className={classnames("island", rootClasses)}
      data-level={variant ? undefined : level}
      data-variant={variant}
      {...rest}
    >
      {children}
    </Component>
  );
}

type IslandContainerOwnProps<T extends ElementType = "div"> = {
  as?: T;
  children: ReactNode;
  direction?: "x" | "y";
  rootClasses?: string;
};

export type IslandContainerProps<T extends ElementType = "div"> =
  IslandContainerOwnProps<T> &
    Omit<
      ComponentPropsWithoutRef<T>,
      keyof IslandContainerOwnProps<T> | "className"
    >;

export function IslandContainer<T extends ElementType = "div">({
  as,
  children,
  direction = "y",
  rootClasses,
  ...rest
}: IslandContainerProps<T>) {
  const Component = (as ?? "div") as ElementType;

  return (
    <Component
      className={classnames(
        "island-container",
        direction === "x" ? "flex--x" : "flex--y",
        rootClasses
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}
