import { IslandContainer } from "~/commonComponents/Island/Island";

import { FooterCopyright } from "./FooterCopyright";
import { FooterLinks } from "./FooterLinks";
import { FooterManagerAd } from "./FooterManagerAd";
import { FooterSocials } from "./FooterSocials";

/**
 * Cyberstorm Footer Component
 *
 * `domain` is the Django origin (VITE_API_URL); Django-served pages like
 * the API docs must link there, since the React Router app doesn't serve
 * them on every deployment origin.
 */
export function Footer(props: { domain: string }) {
  const { domain } = props;
  return (
    <IslandContainer as="footer" rootClasses="footer">
      <FooterManagerAd />
      <FooterSocials />
      <FooterLinks domain={domain} />
      <FooterCopyright />
    </IslandContainer>
  );
}

Footer.displayName = "Footer";
