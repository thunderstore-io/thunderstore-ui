"use client";
import {
  BreadCrumbs,
  CyberstormLink,
  PageHeader,
} from "@thunderstore/cyberstorm";

import { ReactNode } from "react";

import rootStyles from "../../RootLayout.module.css";
import React from "react";

export default function TeamsLayout(props: {
  settingsContent: ReactNode;
  params: { team: string };
}) {
  return (
    <>
      <BreadCrumbs>
        <CyberstormLink linkId="Teams">Teams</CyberstormLink>
        <CyberstormLink linkId="TeamSettings" team={props.params.team}>
          {props.params.team}
        </CyberstormLink>
      </BreadCrumbs>
      <header className={rootStyles.pageHeader}>
        <PageHeader title={props.params.team} />
      </header>
      <main className={rootStyles.main}>{props.settingsContent}</main>
    </>
  );
}
