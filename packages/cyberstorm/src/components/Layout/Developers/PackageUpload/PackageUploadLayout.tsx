import styles from "./PackageUploadLayout.module.css";
import { Title } from "../../../Title/Title";
import { BreadCrumbs } from "../../../BreadCrumbs/BreadCrumbs";
import { CommunityLink } from "../../../Links/Links";
import { SettingItem } from "../../../SettingItem/SettingItem";
import { TextInput } from "../../../TextInput/TextInput";
import { Button } from "../../../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

/**
 * Cyberstorm PackageUpload Layout
 */
export function PackageUploadLayout() {
  return (
    <div className={styles.root}>
      <BreadCrumbs>
        <CommunityLink community={"Developers"}>Developers</CommunityLink>
      </BreadCrumbs>
      <Title text="Upload Package" />
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
            <Button
              label="Create Team"
              rightIcon={<FontAwesomeIcon icon={faPlus} fixedWidth />}
            />
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
            <Button label="Reset" colorScheme="danger" />
            <Button label="Submit" colorScheme="primary" />
          </div>
        }
      />
    </div>
  );
}

PackageUploadLayout.displayName = "PackageUploadLayout";
PackageUploadLayout.defaultProps = {};
