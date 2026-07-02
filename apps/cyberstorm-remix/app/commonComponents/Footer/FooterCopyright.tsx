import { Island } from "~/commonComponents/Island/Island";

import { NewLink } from "@thunderstore/cyberstorm";

export function FooterCopyright() {
  return (
    <Island rootClasses="footer__section footer__copyright">
      <div className="footer__content">
        <div className="footer__copyright__links">
          <NewLink
            primitiveType="link"
            rootClasses="footer__nav__link"
            href="https://pages.thunderstore.io/p/contact-us"
          >
            Contact Us
          </NewLink>
          <NewLink
            primitiveType="link"
            rootClasses="footer__nav__link"
            href="https://pages.thunderstore.io/p/privacy-policy"
          >
            Privacy Policy
          </NewLink>
          <NewLink
            primitiveType="link"
            rootClasses="footer__nav__link"
            href="https://blog.thunderstore.io/"
          >
            News
          </NewLink>
        </div>
        <p>
          © 2026 Thunderstore and contributors.{" "}
          <span>
            This page is{" "}
            <NewLink
              primitiveType="link"
              href="https://github.com/thunderstore-io/thunderstore-ui/"
              aria-label="This page is open source, link to Thunderstore UIs Github page"
              rootClasses="footer__nav__link footer__open-source-link"
            >
              open-source ❤
            </NewLink>
          </span>
        </p>
      </div>
    </Island>
  );
}

FooterCopyright.displayName = "FooterCopyright";
