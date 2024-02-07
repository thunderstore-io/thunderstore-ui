import "@thunderstore/cyberstorm-styles";
import rootStyles from "../RootLayout.module.css";
import React from "react";

export default function TeamsLayout(props: React.PropsWithChildren) {
  return (
    <section className={rootStyles.content}>
      <div className={rootStyles.container}>{props.children}</div>
    </section>
  );
}
