import "@thunderstore/cyberstorm-styles";
import styles from "./RootLayout.module.css";
import Providers from "@/utils/provider";
import {
  AdContainer,
  CyberstormProviders,
  Footer,
  Header,
} from "@thunderstore/cyberstorm";
import React, { Suspense } from "react";
import { ServerDapper } from "@/dapper/server";
import { ClientDapper } from "@/dapper/client";
import { AdContext } from "@/utils/adProvider";

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
                  <section className={styles.content}>
                    <div className={styles.sideContainers} />
                    <div className={styles.middleContainer}>
                      <Suspense fallback={<p>TODO: SKELETON</p>}>
                        {props.children}
                      </Suspense>
                    </div>
                    <div className={styles.sideContainers}>
                      <AdContainer
                        containerId="right-column-1"
                        context={AdContext}
                      />
                      <AdContainer
                        containerId="right-column-2"
                        context={AdContext}
                      />
                      <AdContainer
                        containerId="right-column-3"
                        context={AdContext}
                      />
                    </div>
                  </section>
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
