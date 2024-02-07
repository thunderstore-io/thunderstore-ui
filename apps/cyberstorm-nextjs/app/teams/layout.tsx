import "@thunderstore/cyberstorm-styles";
import rootStyles from "../RootLayout.module.css";
import { BreadCrumbs, TeamsLink } from "@thunderstore/cyberstorm";
import React from "react";
import { PageHeader } from "@thunderstore/cyberstorm/src/components/Layout/BaseLayout/PageHeader/PageHeader";

export default function TeamsLayout(props: React.PropsWithChildren) {
  return (
    <section className={rootStyles.content}>
      <div className={rootStyles.container}>
        <BreadCrumbs>
          <TeamsLink>Teams</TeamsLink>
        </BreadCrumbs>
        <header className={rootStyles.pageHeader}>
          <PageHeader title="Teams" />
        </header>
        {props.children}
      </div>
    </section>
  );
}
