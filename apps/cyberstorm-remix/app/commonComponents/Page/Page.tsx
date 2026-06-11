import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import { classnames } from "@thunderstore/cyberstorm";

import "./Page.css";

type PageOwnProps = {
  as?: ElementType;
  children: ReactNode;
  rootClasses?: string;
};

export type PageProps = PageOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof PageOwnProps | "className">;

export function Page({
  as: Component = "div",
  children,
  rootClasses,
  ...rest
}: PageProps) {
  return (
    <Component className={classnames("page", rootClasses)} {...rest}>
      {children}
    </Component>
  );
}
