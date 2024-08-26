import { faCaretDown, faCode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as Button from "../Button/";
import { DropDown, DropDownItem } from "../DropDown/DropDown";
import { DropDownLink } from "../DropDown/DropDownLink";
import styles from "./Header.module.css";

interface Props {
  squareButton?: boolean;
}

export const DevelopersDropDown = (props: Props) => (
  <DropDown
    trigger={
      props.squareButton ? (
        <Button.Root
          paddingSize="mediumSquare"
          colorScheme="default"
          tooltipText="Developers"
          className={styles.developersSquareButton}
        >
          <Button.ButtonIcon>
            <FontAwesomeIcon icon={faCode} />
          </Button.ButtonIcon>
        </Button.Root>
      ) : (
        <Button.Root paddingSize="large" colorScheme="transparentDefault">
          <Button.ButtonLabel fontSize="large" fontWeight="600">
            Developers
          </Button.ButtonLabel>
          <Button.ButtonIcon>
            <FontAwesomeIcon icon={faCaretDown} />
          </Button.ButtonIcon>
        </Button.Root>
      )
    }
    content={[
      <a href="/api/docs" key="docs">
        <DropDownItem content={<DropDownLink label="API Docs" />} />
      </a>,
      <a href="https://github.com/thunderstore-io" key="github">
        <DropDownItem content={<DropDownLink label="GitHub" isExternal />} />
      </a>,
      <a href="/package/create/docs/" key="old_format_docs">
        <DropDownItem content={<DropDownLink label="Package Format Docs" />} />
      </a>,
      <a href="/tools/markdown-preview/" key="old_markdown_preview">
        <DropDownItem content={<DropDownLink label="Markdown Preview" />} />
      </a>,
      <a href="/tools/manifest-v1-validator/" key="old_manifest_validator">
        <DropDownItem content={<DropDownLink label="Manifest Validator" />} />
      </a>,
    ]}
  />
);

DevelopersDropDown.displayName = "DevelopersDropDown";
