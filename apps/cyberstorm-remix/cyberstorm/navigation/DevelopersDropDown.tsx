import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  DropDown,
  DropDownItem,
  Icon,
  NewButton,
} from "@thunderstore/cyberstorm";
import { DropDownLink } from "@thunderstore/cyberstorm/src/components/DropDown/DropDownLink";

export function DevelopersDropDown() {
  return (
    <>
      <DropDown
        trigger={
          <NewButton size="l" variant="tertiary" color="surface">
            Developers
            <Icon inline>
              <FontAwesomeIcon icon={faCaretDown} />
            </Icon>
          </NewButton>
        }
        content={[
          <a href="/api/docs" key="docs">
            <DropDownItem content={<DropDownLink label="API Docs" />} />
          </a>,
          <a href="/package/create/docs/" key="old_format_docs">
            <DropDownItem
              content={<DropDownLink label="Package Format Docs" />}
            />
          </a>,
          <a href="/tools/manifest-v1-validator/" key="old_manifest_validator">
            <DropDownItem
              content={<DropDownLink label="Manifest Validator" />}
            />
          </a>,
          <a href="/tools/markdown-preview/" key="old_markdown_preview">
            <DropDownItem content={<DropDownLink label="Markdown Preview" />} />
          </a>,
          <a href="https://github.com/thunderstore-io" key="github">
            <DropDownItem
              content={<DropDownLink label="GitHub" isExternal />}
            />
          </a>,
        ]}
      />
    </>
  );
}

DevelopersDropDown.displayName = "DevelopersDropDown";
