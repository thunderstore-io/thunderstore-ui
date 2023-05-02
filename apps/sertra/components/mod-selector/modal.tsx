import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIceCream, faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";

import { ButtonPrimary, ButtonSecondary } from "./button";
import { IconButton } from "./iconButton";
import { ModListRow } from "./list";
import styles from "./modal.module.css";
import { SearchBox } from "./search";
import { ModPackage } from "../../api/models";
import { modPackageSort } from "../../utils/types";

interface Closable {
  close: () => void;
}

interface ModalHeaderProps extends PropsWithChildren, Closable {
  title?: string;
}

export function ModalHeader({ children, close, title }: ModalHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.headerTitle}>
        <IconButton
          content={<FontAwesomeIcon icon={faXmark} />}
          buttonProps={{ onClick: close }}
        />
        {title && <h2>{title}</h2>}
      </div>
      {children}
    </div>
  );
}

export function ModalContent({ children }: PropsWithChildren) {
  return <div className={styles.content}>{children}</div>;
}

interface ModalFooterProps extends Closable {
  save: () => void;
}

export function ModalFooter({ close, save }: ModalFooterProps) {
  return (
    <div className={styles.footer}>
      <ButtonSecondary onClick={close}>Cancel</ButtonSecondary>
      <ButtonPrimary onClick={save}>Done</ButtonPrimary>
    </div>
  );
}

export function NoModsSelectedNotice() {
  return (
    <div className={styles.noMods}>
      <FontAwesomeIcon className={styles.noModsIcon} icon={faIceCream} />
      <p className={styles.noModsText}>
        Vanilla is good, but we want none of that here.
      </p>
      <p className={styles.noModsText}>Add some mods!</p>
    </div>
  );
}

interface ModSelectorProps extends Closable {
  allMods: ModPackage[];
  currentlySelected: ModPackage[];
  setCurrentlySelected: Dispatch<SetStateAction<ModPackage[]>>;
  visible: boolean;
}

export function ModSelectorModal(props: ModSelectorProps) {
  const { allMods, close, currentlySelected, setCurrentlySelected, visible } =
    props;

  // Changes done in the modal are temporary until user clicks "Done".
  const [tempSelected, setTempSelected] = useState(currentlySelected);

  useEffect(
    () => setTempSelected(currentlySelected),
    [currentlySelected, setTempSelected]
  );

  const selectableMods = useMemo(() => {
    return allMods.filter((x) => !tempSelected.find((y) => y.id == x.id));
  }, [allMods, tempSelected]);

  const selectMod: (selection: ModPackage) => void = useMemo(() => {
    return (selection: ModPackage) => {
      if (selectableMods.find((x) => x.id == selection.id)) {
        setTempSelected((current) =>
          [...current, selection].sort(modPackageSort)
        );
      }
    };
  }, [selectableMods, setTempSelected]);

  const deselectMod: (selection: ModPackage) => void = useMemo(() => {
    return (selection: ModPackage) => {
      if (tempSelected.find((x) => x.id == selection.id)) {
        setTempSelected(tempSelected.filter((y) => y.id != selection.id));
      }
    };
  }, [tempSelected, setTempSelected]);

  const resetAndClose = () => {
    setTempSelected(currentlySelected);
    close();
  };

  const saveAndClose = () => {
    setCurrentlySelected(tempSelected);
    close();
  };

  return (
    <div className={`${styles.background} ${visible ? styles.visible : ""}`}>
      <div className={styles.modal}>
        <ModalHeader title={"Mods"} close={resetAndClose}>
          <SearchBox
            placeholder={"Search mods..."}
            options={selectableMods}
            renderOption={(option) => (
              <ModListRow modPackage={option} showControls={false} />
            )}
            keyExtractor={(option) => option.id}
            onSelect={selectMod}
          />
        </ModalHeader>
        <ModalContent>
          {!tempSelected.length && <NoModsSelectedNotice />}
          {tempSelected.map((mod) => (
            <ModListRow
              key={mod.id}
              modPackage={mod}
              onDelete={deselectMod}
              setTempSelected={setTempSelected}
              showControls={true}
            />
          ))}
        </ModalContent>
        <ModalFooter close={resetAndClose} save={saveAndClose} />
      </div>
    </div>
  );
}
