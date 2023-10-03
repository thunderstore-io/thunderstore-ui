"use client";
import styles from "./PackageUploadLayout.module.css";
import { Title } from "../../../Title/Title";
import { BreadCrumbs } from "../../../BreadCrumbs/BreadCrumbs";
import { PackageUploadLink } from "../../../Links/Links";
import { SettingItem } from "../../../SettingItem/SettingItem";
import { TextInput } from "../../../TextInput/TextInput";
import * as Button from "../../../Button/";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { BaseLayout } from "../../BaseLayout/BaseLayout";
import { Icon } from "../../../Icon/Icon";

/**
 * Cyberstorm PackageUpload Layout
 */
export function PackageUploadLayout() {
  return (
    <BaseLayout
      breadCrumb={
        <BreadCrumbs>
          <PackageUploadLink>Package Upload</PackageUploadLink>
        </BreadCrumbs>
      }
      header={<Title text="Upload Package" />}
      mainContent={
        <>
          <SettingItem
            title="Upload file"
            description="Upload your package as a ZIP file."
            content={<TextInput />}
          />
          <div className={styles.line} />
          <SettingItem
            title="Team"
            description="No teams available?"
            additionalLeftColumnContent={
              <div>
                <Button.Root>
                  <Button.ButtonLabel>Create Team</Button.ButtonLabel>
                  <Button.ButtonLabel>
                    <Icon>
                      <FontAwesomeIcon icon={faPlus} />
                    </Icon>
                  </Button.ButtonLabel>
                </Button.Root>
              </div>
            }
            content={<TextInput />}
          />
          <SettingItem
            title="Communities"
            description="Select communities you want your package to be listed under. Current community is selected by default."
            content={<TextInput />}
          />
          <SettingItem
            title="Categories"
            description="Select descriptive categories to help people discover your package."
            content={<TextInput />}
          />
          <div className={styles.line} />
          <SettingItem
            title="Contains NSFW content"
            description='A "NSFW" -tag will be applied to your package.'
            content=""
          />
          <div className={styles.line} />
          <SettingItem
            title="Submit"
            description='Double-check your selections and hit "Submit" when you are ready!'
            content={
              <div className={styles.submit}>
                <Button.Root colorScheme="danger">
                  <Button.ButtonLabel>Reset</Button.ButtonLabel>
                </Button.Root>
                <Button.Root colorScheme="accent">
                  <Button.ButtonLabel>Submit</Button.ButtonLabel>
                </Button.Root>
              </div>
            }
          />
        </>
      }
    />
  );
}

PackageUploadLayout.displayName = "PackageUploadLayout";
