import { faCaretDown } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Button } from "../Button/Button";
import { DropDown, DropDownItem } from "../DropDown/DropDown";
import { DropDownLink } from "../DropDown/DropDownLink";
import {
  ManifestValidatorLink,
  MarkdownPreviewLink,
  PackageFormatDocsLink,
  PackageUploadLink,
} from "../Links/Links";

export const DevelopersDropDown = () => (
  <DropDown
    triggerColorScheme="transparentDefault"
    trigger={
      <Button
        label="Developers"
        rightIcon={<FontAwesomeIcon icon={faCaretDown} fixedWidth />}
        paddingSize="large"
        fontSize="large"
      />
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
