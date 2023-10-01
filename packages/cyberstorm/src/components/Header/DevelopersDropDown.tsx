import { faCaretDown } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as Button from "../Button/";
import { DropDown, DropDownItem } from "../DropDown/DropDown";
import { DropDownLink } from "../DropDown/DropDownLink";
import {
  ManifestValidatorLink,
  MarkdownPreviewLink,
  PackageFormatDocsLink,
  PackageUploadLink,
} from "../Links/Links";
import { Icon } from "../Icon/Icon";

export const DevelopersDropDown = () => (
  <DropDown
    triggerColorScheme="transparentDefault"
    trigger={
      <Button.Root paddingSize="large">
        <Button.Label fontSize="large">Developers</Button.Label>
        <Button.Icon>
          <Icon>
            <FontAwesomeIcon icon={faCaretDown} />
          </Icon>
        </Button.Icon>
      </Button.Root>
    }
    content={[
      <a href="/wiki" key="wiki">
        <DropDownItem
          content={<DropDownLink label="Modding Wiki" isExternal />}
        />
      </a>,
      <a href="/docs" key="docs">
        <DropDownItem content={<DropDownLink label="API Docs" isExternal />} />
      </a>,
      <a href="/git" key="github">
        <DropDownItem
          content={<DropDownLink label="GitHub Repo" isExternal />}
        />
      </a>,
      <PackageFormatDocsLink key="package-format">
        <DropDownItem content={<DropDownLink label="Package Format Docs" />} />
      </PackageFormatDocsLink>,
      <MarkdownPreviewLink key="markdown-preview">
        <DropDownItem content={<DropDownLink label="Markdown Preview" />} />
      </MarkdownPreviewLink>,
      <ManifestValidatorLink key="manifest-validator">
        <DropDownItem content={<DropDownLink label="Manifest Validator" />} />
      </ManifestValidatorLink>,
      <PackageUploadLink key="upload-package">
        <DropDownItem content={<DropDownLink label="Upload Package" />} />
      </PackageUploadLink>,
    ]}
  />
);

DevelopersDropDown.displayName = "DevelopersDropDown";
