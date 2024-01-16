import { faCaretDown } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as Button from "../Button/";
import { DropDown, DropDownItem } from "../DropDown/DropDown";
import { DropDownLink } from "../DropDown/DropDownLink";

export const DevelopersDropDown = () => (
  <DropDown
    triggerColorScheme="transparentDefault"
    trigger={
      <Button.Root paddingSize="large">
        <Button.ButtonLabel fontSize="large" fontWeight="600">
          Developers
        </Button.ButtonLabel>
        <Button.ButtonIcon>
          <FontAwesomeIcon icon={faCaretDown} />
        </Button.ButtonIcon>
      </Button.Root>
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
      <a href="/tools/markdown-preview/" key="old_format_docs">
        <DropDownItem content={<DropDownLink label="Markdown Preview" />} />
      </a>,
      <a href="/tools/manifest-v1-validator/" key="old_manifest_validator">
        <DropDownItem content={<DropDownLink label="Manifest Validator" />} />
      </a>,
    ]}
  />
);

DevelopersDropDown.displayName = "DevelopersDropDown";
