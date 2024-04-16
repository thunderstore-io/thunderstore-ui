"use client";
import styles from "./PackageUploadLayout.module.css";
import { Title } from "../../../Title/Title";
import { BreadCrumbs } from "../../../BreadCrumbs/BreadCrumbs";
import { CyberstormLink } from "../../../Links/Links";
import { SettingItem } from "../../../SettingItem/SettingItem";
import { TextInput } from "../../../TextInput/TextInput";
import * as Button from "../../../Button/";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { BaseLayout } from "../../BaseLayout/BaseLayout";
import { CreateTeamForm } from "@thunderstore/cyberstorm-forms";
import { Dialog } from "../../../..";
import { useState } from "react";

/**
 * Cyberstorm PackageUpload Layout
 */
export function PackageUploadLayout() {
  const [dialogOpen, setOpenDialog] = useState(false);
  return (
    <BaseLayout
      breadCrumb={
        <BreadCrumbs>
          <CyberstormLink linkId="PackageUpload">Package Upload</CyberstormLink>
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
              <Dialog.Root
                open={dialogOpen}
                onOpenChange={setOpenDialog}
                title="Create Team"
                trigger={
                  <Button.Root colorScheme="primary" paddingSize="large">
                    <Button.ButtonLabel>Create team</Button.ButtonLabel>
                    <Button.ButtonIcon>
                      <FontAwesomeIcon icon={faPlus} />
                    </Button.ButtonIcon>
                  </Button.Root>
                }
              >
                <CreateTeamForm dialogOnChange={setOpenDialog} />
              </Dialog.Root>
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
