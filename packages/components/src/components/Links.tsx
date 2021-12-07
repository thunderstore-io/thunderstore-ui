import React from "react";
import { LinkingContext, LinkLibrary } from "./LinkingProvider";

export const Anonymous: LinkLibrary["Anonymous"] = (props) => {
  const Links = React.useContext(LinkingContext);
  return <Links.Anonymous {...props} />;
};

export const Index: LinkLibrary["Index"] = (props) => {
  const Links = React.useContext(LinkingContext);
  return <Links.Index {...props} />;
};

export const Package: LinkLibrary["Package"] = (props) => {
  const Links = React.useContext(LinkingContext);
  return <Links.Package {...props} />;
};
