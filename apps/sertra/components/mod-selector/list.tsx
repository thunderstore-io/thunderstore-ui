import { Dispatch, SetStateAction } from "react";

import { ModPackage } from "../../api/models";
import { modPackageSort } from "../../utils/types";
import { IconButton } from "./iconButton";
import styles from "./list.module.css";

export interface ModRowInfoProps {
  iconUrl: string;
  packageName: string;
  ownerName: string;
}
export function ModRowInfo(props: ModRowInfoProps) {
  const { iconUrl, packageName, ownerName } = props;
  return (
    <>
      <div className={styles.colSmall}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.rowIcon} alt="mod icon" src={iconUrl} />
      </div>
      <div className={styles.colLarge}>
        <span className={styles.packageName}>{packageName}</span>
        <span className={styles.ownerName}>by {ownerName}</span>
      </div>
    </>
  );
}

export interface ModRowControlsProps {
  modPackage: ModPackage;
  onDelete?: (selection: ModPackage) => void;
  setTempSelected?: Dispatch<SetStateAction<ModPackage[]>>;
}
export function ModRowControls({
  modPackage,
  onDelete,
  setTempSelected,
}: ModRowControlsProps) {
  const onChange = (selectedVersion: string) =>
    setTempSelected?.((current) => {
      const otherMods = current.filter((m) => m.id !== modPackage.id);
      const updatedMod = { ...modPackage, selectedVersion };
      return [...otherMods, updatedMod].sort(modPackageSort);
    });

  return (
    <>
      <div className={styles.colSmall}>
        <div className={styles.selectWrapper}>
          <select
            className={styles.versionSelect}
            onChange={(e) => onChange(e.target.value)}
            value={modPackage.selectedVersion}
          >
            {modPackage.versionNumbers.map((vernum) => {
              return (
                <option key={vernum} value={vernum}>
                  {vernum}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div className={styles.colSmall}>
        <IconButton
          content={"🗑"}
          buttonProps={{ onClick: () => onDelete?.(modPackage) }}
        />
      </div>
    </>
  );
}

export interface ModListEntryProps extends ModRowControlsProps {
  showControls?: boolean;
}
export function ModListRow(props: ModListEntryProps) {
  const { modPackage, showControls } = props;

  return (
    <div className={styles.row}>
      <ModRowInfo
        iconUrl={modPackage.iconUrl}
        packageName={modPackage.packageName}
        ownerName={modPackage.ownerName}
      />
      {showControls && <ModRowControls {...props} />}
    </div>
  );
}
