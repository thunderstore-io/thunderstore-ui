import { Heading, NewLink } from "@thunderstore/cyberstorm";

import "./FooterLinks.css";

export function FooterLinks({ domain }: { domain: string }) {
  return (
    <nav className="footer-links">
      <div className="footer-links__section">
        <Heading csVariant="primary" mode="heading" csLevel="2" csSize="4">
          Thunderstore
        </Heading>
        <ul className="footer-links__list">
          <li>
            <NewLink
              primitiveType="cyberstormLink"
              linkId="Communities"
              rootClasses="footer-link"
            >
              Communities
            </NewLink>
          </li>
        </ul>
      </div>
      <div className="footer-links__section" aria-label="Developer links">
        <Heading csVariant="primary" mode="heading" csLevel="2" csSize="4">
          Developers
        </Heading>
        <ul className="footer-links__list">
          <li>
            <NewLink
              primitiveType="link"
              href={`${domain}/api/docs/`}
              rootClasses="footer-link"
            >
              API Documentation
            </NewLink>
          </li>
          <li>
            <NewLink
              primitiveType="link"
              href="https://wiki.thunderstore.io/mods/creating-a-package"
              rootClasses="footer-link"
            >
              Package Format Docs
            </NewLink>
          </li>
          <li>
            <NewLink
              primitiveType="cyberstormLink"
              linkId="ManifestValidator"
              rootClasses="footer-link"
            >
              Manifest Validator
            </NewLink>
          </li>
          <li>
            <NewLink
              primitiveType="cyberstormLink"
              linkId="MarkdownPreview"
              rootClasses="footer-link"
            >
              Markdown Preview
            </NewLink>
          </li>
          <li>
            <NewLink
              primitiveType="link"
              href="https://github.com/thunderstore-io"
              rootClasses="footer-link"
            >
              GitHub
            </NewLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

FooterLinks.displayName = "FooterLinks";
