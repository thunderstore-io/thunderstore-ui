import styles from "./PackageDetailLayout.module.css";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { CommunitiesLink, CommunityLink, PackageLink } from "../../Links/Links";
import { MetaItem } from "../../MetaItem/MetaItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../../Button/Button";
import { ModIcon } from "../../ModIcon/ModIcon";
import { Title } from "../../Title/Title";
import { Dialog } from "../../Dialog/Dialog";
import { PackageManagementForm } from "./PackageManagementForm";
import { getPackageDummyData } from "../../../dummyData";
import { BaseLayout } from "../BaseLayout/BaseLayout";
import { MetaInfoItemList } from "../../MetaInfoItemList/MetaInfoItemList";
import {
  faDonate,
  faDownload,
  faCog,
  faHouse,
  faUser,
  faThumbsUp,
  faFlag,
} from "@fortawesome/pro-solid-svg-icons";

export interface PackageDetailLayoutProps {
  packageId: string;
  managementDialogIsOpen?: boolean;
}

/**
 * Cyberstorm PackageDetail Layout
 */
export function PackageDetailLayout(props: PackageDetailLayoutProps) {
  const { packageId, managementDialogIsOpen = false } = props;
  const packageData = getPackageData(packageId);

  return (
    <BaseLayout
      breadCrumb={
        <BreadCrumbs>
          <CommunitiesLink>Communities</CommunitiesLink>
          <CommunityLink community={packageData.community}>
            {packageData.community}
          </CommunityLink>
          <PackageLink
            namespace={packageData.namespace}
            community={packageData.community}
            package={packageData.name}
          >
            {packageData.name}
          </PackageLink>
        </BreadCrumbs>
      }
      header={
        <div className={styles.packageInfo}>
          <ModIcon src={packageData.imageSource}></ModIcon>
          <div className={styles.packageInfoDetails}>
            <Title text={packageData.name}></Title>
            <p className={styles.packageInfoDescription}>
              {packageData.shortDescription}
            </p>
            <div className={styles.packageInfoMeta}>
              <MetaItem
                colorScheme="tertiary"
                label={packageData.author}
                icon={<FontAwesomeIcon icon={faUser} fixedWidth />}
              />
              <Button
                label={packageData.gitHubLink}
                colorScheme="transparentPrimary"
                leftIcon={<FontAwesomeIcon icon={faHouse} fixedWidth />}
              />
            </div>
          </div>
          <div className={styles.managementDialogTrigger}>
            <Dialog
              defaultOpen={managementDialogIsOpen}
              title="Manage Package"
              content={<PackageManagementForm />}
              acceptButton={
                <Button label="Save changes" colorScheme="primary" />
              }
              additionalFooterContent={
                <Button label="Deprecate" colorScheme="warning" />
              }
              trigger={
                <Button
                  leftIcon={<FontAwesomeIcon icon={faCog} fixedWidth />}
                  label="Manage"
                />
              }
            />
          </div>
        </div>
      }
      mainContent={
        <>
          <Title text={packageData.name} />
          <p className={styles.description}>{packageData.description}</p>
        </>
      }
      rightSidebarContent={
        <div className={styles.metaInfo}>
          <div className={styles.metaButtonWrapper}>
            <Button
              leftIcon={<FontAwesomeIcon icon={faDownload} fixedWidth />}
              label="Download"
            />
            <Button leftIcon={<FontAwesomeIcon icon={faDonate} fixedWidth />} />
            <Button
              leftIcon={<FontAwesomeIcon icon={faThumbsUp} fixedWidth />}
            />
            <Button leftIcon={<FontAwesomeIcon icon={faFlag} fixedWidth />} />
          </div>
          <MetaInfoItemList metaInfoData={metaInfoData} />
        </div>
      }
    />
  );
}

PackageDetailLayout.displayName = "PackageDetailLayout";

function getPackageData(packageId: string) {
  return getPackageDummyData(packageId);
}

const metaInfoData = [
  { key: "1", label: "Last Updated", content: <>asd</> },
  { key: "2", label: "First Updated", content: <>qwer</> },
];
