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
          <NewButton csSize="l" csVariant="tertiary" csColor="surface">
            Developers
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faCaretDown} />
            </NewIcon>
          </NewButton>
        }
        csVariant="default"
        csColor="surface"
        rootClasses={styles.root}
      >
        <NewDropDownItem>
          <NewLink
            primitiveType="link"
            csVariant="primary"
            csTextStyles={["fontSizeS", "fontWeightRegular"]}
            href="/api/docs"
          >
            API Docs
          </NewLink>
        </NewDropDownItem>
        <NewDropDownItem>
          <NewLink
            primitiveType="link"
            csVariant="primary"
            csTextStyles={["fontSizeS", "fontWeightRegular"]}
            href="/package/create/docs/"
          >
            Package Format Docs
          </NewLink>
        </NewDropDownItem>
        <NewDropDownItem>
          <NewLink
            primitiveType="link"
            csVariant="primary"
            csTextStyles={["fontSizeS", "fontWeightRegular"]}
            href="/tools/manifest-v1-validator/"
          >
            Manifest Validator
          </NewLink>
        </NewDropDownItem>
        <NewDropDownItem>
          <NewLink
            primitiveType="link"
            csVariant="primary"
            csTextStyles={["fontSizeS", "fontWeightRegular"]}
            href="/tools/markdown-preview/"
          >
            Markdown Preview
          </NewLink>
        </NewDropDownItem>
        <NewDropDownItem rootClasses={styles.focus}>
          <NewLink
            primitiveType="link"
            csVariant="primary"
            csTextStyles={["fontSizeS", "fontWeightRegular"]}
            href="https://github.com/thunderstore-io"
            rootClasses={styles.externalLink}
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
