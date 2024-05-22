import { faCaretDown } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { DropDown, Button, DropDownItem } from "@thunderstore/cyberstorm";
import { DropDownLink } from "@thunderstore/cyberstorm/src/components/DropDown/DropDownLink";
const { Root, ButtonLabel, ButtonIcon } = Button;

export function DevelopersDropDown() {
  return (
    <DropDown
      trigger={
        <Root paddingSize="large" colorScheme="transparentDefault">
          <ButtonLabel fontSize="large" fontWeight="600">
            Developers
          </ButtonLabel>
          <ButtonIcon>
            <FontAwesomeIcon icon={faCaretDown} />
          </ButtonIcon>
        </Root>
      }
      content={[
        <a href="/api/docs" key="docs">
          <DropDownItem content={<DropDownLink label="API Docs" />} />
        </a>,
        <a href="https://github.com/thunderstore-io" key="github">
          <DropDownItem content={<DropDownLink label="GitHub" isExternal />} />
        </a>,
        <a href="/package/create/docs/" key="old_format_docs">
          <DropDownItem
            content={<DropDownLink label="Package Format Docs" />}
          />
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
}

DevelopersDropDown.displayName = "DevelopersDropDown";
