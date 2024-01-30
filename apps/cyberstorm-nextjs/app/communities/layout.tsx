import "@thunderstore/cyberstorm-styles";
import rootStyles from "../RootLayout.module.css";
import { BreadCrumbs } from "@thunderstore/cyberstorm";
import React from "react";
import { PageHeader } from "@thunderstore/cyberstorm/src/components/Layout/BaseLayout/PageHeader/PageHeader";

export default function CommunitiesLayout(props: React.PropsWithChildren) {
  return (
    <section className={rootStyles.content}>
      <div className={rootStyles.container}>
        <BreadCrumbs>Communities</BreadCrumbs>
        <header className={rootStyles.pageHeader}>
          <PageHeader title="Communities" />
        </header>
        {props.children}
      </div>
    </section>
  );
}
