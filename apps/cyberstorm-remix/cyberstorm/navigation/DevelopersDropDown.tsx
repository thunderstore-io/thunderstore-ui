import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import styles from "./DevelopersDropDown.module.css";

import {
  NewDropDown,
  NewDropDownItem,
  NewIcon,
  NewButton,
  NewLink,
} from "@thunderstore/cyberstorm";

export function DevelopersDropDown() {
  return (
    <>
      <NewDropDown
        trigger={
          <NewButton csSize="big" csVariant="secondary" csModifiers={["ghost"]}>
            Developers
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faCaretDown} />
            </NewIcon>
          </NewButton>
        }
        rootClasses={styles.root}
      >
        <NewDropDownItem>
          <NewLink
            primitiveType="link"
            rootClasses={styles.link}
            href="/api/docs"
          >
            API Docs
          </NewLink>
        </NewDropDownItem>
        <NewDropDownItem>
          <NewLink
            primitiveType="link"
            rootClasses={styles.link}
            href="/package/create/docs/"
          >
            Package Format Docs
          </NewLink>
        </NewDropDownItem>
        <NewDropDownItem>
          <NewLink
            primitiveType="link"
            rootClasses={styles.link}
            href="/tools/manifest-v1-validator/"
          >
            Manifest Validator
          </NewLink>
        </NewDropDownItem>
        <NewDropDownItem>
          <NewLink
            primitiveType="link"
            rootClasses={styles.link}
            href="/tools/markdown-preview/"
          >
            Markdown Preview
          </NewLink>
        </NewDropDownItem>
        <NewDropDownItem rootClasses={styles.focus}>
          <NewLink
            primitiveType="link"
            rootClasses={styles.externalLink}
            href="https://github.com/thunderstore-io"
          >
            Github
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </NewIcon>
          </NewLink>
        </NewDropDownItem>
      </NewDropDown>
    </>
  );
}

DevelopersDropDown.displayName = "DevelopersDropDown";
