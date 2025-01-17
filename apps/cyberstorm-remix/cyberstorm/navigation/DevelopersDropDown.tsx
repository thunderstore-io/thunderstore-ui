import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./DevelopersDropDown.module.css";

import {
  NewDropDown,
  NewDropDownItem,
  NewIcon,
  NewButton,
  NewLink,
} from "@thunderstore/cyberstorm";
import { faArrowUpRight } from "@fortawesome/pro-solid-svg-icons";
import { classnames } from "@thunderstore/cyberstorm/src/utils/utils";

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
            rootClasses={"ts-dropdown__item"}
            href="/api/docs"
          >
            API Docs
          </NewLink>
        </NewDropDownItem>
        <NewDropDownItem>
          <NewLink
            primitiveType="link"
            rootClasses={"ts-dropdown__item"}
            href="/package/create/docs/"
          >
            Package Format Docs
          </NewLink>
        </NewDropDownItem>
        <NewDropDownItem>
          <NewLink
            primitiveType="link"
            rootClasses={"ts-dropdown__item"}
            href="/tools/manifest-v1-validator/"
          >
            Manifest Validator
          </NewLink>
        </NewDropDownItem>
        <NewDropDownItem>
          <NewLink
            primitiveType="link"
            rootClasses={"ts-dropdown__item"}
            href="/tools/markdown-preview/"
          >
            Markdown Preview
          </NewLink>
        </NewDropDownItem>
        <NewDropDownItem rootClasses={styles.focus}>
          <NewLink
            primitiveType="link"
            rootClasses={classnames(styles.externalLink, "ts-dropdown__item")}
            href="https://github.com/thunderstore-io"
          >
            Github
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faArrowUpRight} />
            </NewIcon>
          </NewLink>
        </NewDropDownItem>
      </NewDropDown>
    </>
  );
}

DevelopersDropDown.displayName = "DevelopersDropDown";
