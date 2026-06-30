import { NewLink } from "@thunderstore/cyberstorm";

import "./FooterCopyright.css";

export function FooterCopyright() {
  return (
    <div className="footer-copyright">
      <nav className="footer-copyright__links">
        <NewLink
          primitiveType="link"
          rootClasses="footer-link"
          href="https://pages.thunderstore.io/p/contact-us"
        >
          Contact Us
        </NewLink>
        <NewLink
          primitiveType="link"
          rootClasses="footer-link"
          href="https://pages.thunderstore.io/p/privacy-policy"
        >
          Privacy Policy
        </NewLink>
        <NewLink
          primitiveType="link"
          rootClasses="footer-link"
          href="https://blog.thunderstore.io/"
        >
          News
        </NewLink>
      </nav>
      <div className="footer-copyright__footnote">
        © 2026 Thunderstore and contributors.{" "}
        <span>
          This page is{" "}
          <NewLink
            primitiveType="link"
            href="https://github.com/thunderstore-io/thunderstore-ui/"
            aria-label="This page is open source, link to Thunderstore UIs Github page"
            rootClasses="footer-link footer-link--secondary"
          >
            open-source ❤
          </NewLink>
        </span>
      </div>
    </div>
  );
}

FooterCopyright.displayName = "FooterCopyright";
