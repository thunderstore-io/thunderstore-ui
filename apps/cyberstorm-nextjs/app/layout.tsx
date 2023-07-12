import "@thunderstore/cyberstorm-styles";
import Providers from "@/utils/provider";
import { CyberstormProviders } from "@thunderstore/cyberstorm";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CyberstormProviders>
          <Providers>{children}</Providers>
        </CyberstormProviders>
      </body>
    </html>
  );
}
