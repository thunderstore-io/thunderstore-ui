import styles from "./PackageChangeLog.module.css";
import { ReactElement } from "react";

interface PackageChangeLogItem {
  versionNumber: string;
  releaseDate: string;
  isCurrent: boolean;
  content?: string | ReactElement;
}

export interface PackageChangeLogProps {
  packageId: string;
}

export function PackageChangeLog(props: PackageChangeLogProps) {
  const { packageId } = props;
  const packageChangeLog: PackageChangeLogItem[] =
    getPackageChangeLog(packageId);

  return (
    <div className={styles.root}>
      <div className={styles.title}>Changelog</div>
      {packageChangeLog.map((changeLogItem) => {
        return (
          <div className={styles.itemWrapper}>
            <div
              className={`${styles.item} ${
                changeLogItem.isCurrent ? styles.isCurrent : null
              }`}
            >
              <div className={styles.header}>
                <div className={styles.versionNumber}>
                  {changeLogItem.versionNumber}
                  {changeLogItem.isCurrent ? (
                    <div className={styles.currentLabel}>
                      {changeLogItem.isCurrent ? "‧ Current" : null}
                    </div>
                  ) : null}
                </div>
                <div className={styles.releaseDate}>
                  {changeLogItem.releaseDate}
                </div>
              </div>
              <div className={styles.content}>{changeLogItem.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

PackageChangeLog.displayName = "PackageChangeLog";

function getPackageChangeLog(packageId: string) {
  return [
    {
      versionNumber: "1.2.3",
      releaseDate: "07/04/2022",
      isCurrent: true,
      content:
        packageId +
        " registration add NetworkSoundEventDef NetworkSoundEventDef registration to SoundAPI add",
    },
    {
      versionNumber: "1.2.2",
      releaseDate: "07/04/2022",
      isCurrent: false,
      content: "Add registration to SoundAPI",
    },
    {
      versionNumber: "1.2.1",
      releaseDate: "07/04/2022",
      isCurrent: false,
      content: "Add NetworkSoundEventDef",
    },
    {
      versionNumber: "1.1.0",
      releaseDate: "07/04/2022",
      isCurrent: false,
      content: "Add SoundAPI",
    },
  ];
}
