import "@thunderstore/cyberstorm-styles";
import styles from "./RootLayout.module.css";
import Providers from "@/utils/provider";
import { CyberstormProviders, Footer, Header } from "@thunderstore/cyberstorm";
import React from "react";
import { ServerDapper } from "@/dapper/server";
import { ClientDapper } from "@/dapper/client";

export default function RootLayout(props: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <ServerDapper>
          <ClientDapper>
            <CyberstormProviders>
              <Providers>
                <div className={styles.root}>
                  <Header />
                  {props.children}
                  <Footer />
                </div>
              </Providers>
            </CyberstormProviders>
          </ClientDapper>
        </ServerDapper>
      </body>
    </html>
  );
}
