import "@thunderstore/cyberstorm-styles";
import styles from "./RootLayout.module.css";
import Providers from "@/utils/provider";
import { CyberstormProviders, Footer, Header } from "@thunderstore/cyberstorm";
import React, { Suspense } from "react";
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
                  <Suspense fallback={<p>TODO: SKELETON</p>}>
                    {props.children}
                  </Suspense>
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
