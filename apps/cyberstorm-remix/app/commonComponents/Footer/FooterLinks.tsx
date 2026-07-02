import { Island } from "~/commonComponents/Island/Island";

import { Heading, NewLink } from "@thunderstore/cyberstorm";

export function FooterLinks({ domain }: { domain: string }) {
  return (
    <Island rootClasses="footer__section footer__links">
      <div className="footer__content">
        <nav className="footer__nav">
          <div className="footer__nav__section">
            <Heading csVariant="primary" mode="heading" csLevel="2" csSize="4">
              Thunderstore
            </Heading>
            <ul className="footer__nav__link-list">
              <li>
                <NewLink
                  primitiveType="cyberstormLink"
                  linkId="Communities"
                  rootClasses="footer__nav__link"
                >
                  Communities
                </NewLink>
              </li>
            </ul>
          </div>
          <div className="footer__nav__section" aria-label="Developer links">
            <Heading csVariant="primary" mode="heading" csLevel="2" csSize="4">
              Developers
            </Heading>
            <ul className="footer__nav__link-list">
              <li>
                <NewLink
                  primitiveType="link"
                  href={`${domain}/api/docs/`}
                  rootClasses="footer__nav__link"
                >
                  API Documentation
                </NewLink>
              </li>
              <li>
                <NewLink
                  primitiveType="link"
                  href="https://wiki.thunderstore.io/mods/creating-a-package"
                  rootClasses="footer__nav__link"
                >
                  Package Format Docs
                </NewLink>
              </li>
              <li>
                <NewLink
                  primitiveType="cyberstormLink"
                  linkId="ManifestValidator"
                  rootClasses="footer__nav__link"
                >
                  Manifest Validator
                </NewLink>
              </li>
              <li>
                <NewLink
                  primitiveType="cyberstormLink"
                  linkId="MarkdownPreview"
                  rootClasses="footer__nav__link"
                >
                  Markdown Preview
                </NewLink>
              </li>
              <li>
                <NewLink
                  primitiveType="link"
                  href="https://github.com/thunderstore-io"
                  rootClasses="footer__nav__link"
                >
                  GitHub
                </NewLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </Island>
  );
}

FooterLinks.displayName = "FooterLinks";
