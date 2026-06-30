import { Island, IslandContainer } from "~/commonComponents/Island/Island";

import "./Footer.css";
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
      <Island rootClasses="footer__section footer__section--manager">
        <div className="footer__inner">
          <FooterManagerAd />
        </div>
      </Island>
      <Island rootClasses="footer__section footer__section--links">
        <div className="footer__inner">
          <FooterLinks domain={domain} />
        </div>
      </Island>
      <Island rootClasses="footer__section footer__section--socials">
        <div className="footer__inner">
          <FooterSocials />
        </div>
      </Island>
      <Island rootClasses="footer__section footer__section--copyright">
        <div className="footer__inner">
          <FooterCopyright />
        </div>
      </Island>
    </IslandContainer>
  );
}

Footer.displayName = "Footer";
