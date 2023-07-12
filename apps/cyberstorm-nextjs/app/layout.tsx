import "@thunderstore/cyberstorm-styles";
import Providers from "@/utils/provider";
import { CyberstormProviders } from "@thunderstore/cyberstorm";
import { DapperSetup } from "@/app/dapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CyberstormProviders>
          <DapperSetup>
            <Providers>{children}</Providers>
          </DapperSetup>
        </CyberstormProviders>
      </body>
    </html>
  );
}
