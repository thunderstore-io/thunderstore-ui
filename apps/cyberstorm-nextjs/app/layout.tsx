import "@thunderstore/cyberstorm-styles";
import Providers from "@/utils/provider";
import { CyberstormProviders } from "@thunderstore/cyberstorm";
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
              <Providers>{props.children}</Providers>
            </CyberstormProviders>
          </ClientDapper>
        </ServerDapper>
      </body>
    </html>
  );
}
