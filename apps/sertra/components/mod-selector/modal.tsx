import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useMemo,
  useState,
} from "react";

import { ButtonPrimary, ButtonSecondary } from "./button";
import { IconButton } from "./iconButton";
import { ModListRow } from "./list";
import styles from "./modal.module.css";
import { SearchBox } from "./search";
import { ModPackage } from "../../api/models";

interface Closable {
  close: () => void;
}

interface ModalHeaderProps extends PropsWithChildren, Closable {
  title?: string;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  children,
  close,
  title,
}) => {
  return (
    <div className={styles.header}>
      <div className={styles.headerTitle}>
        <div>{title && <h2>{title}</h2>}</div>
        <div>
          <IconButton
            content={<FontAwesomeIcon icon={faXmark} />}
            buttonProps={{ onClick: close }}
          />
        </div>
      </div>
      {children && <div className={styles.headerContent}>{children}</div>}
    </div>
  );
};

export const ModalContent: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className={styles.content}>{children}</div>;
};

interface ModalFooterProps extends Closable {
  save: () => void;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({ close, save }) => {
  return (
    <div className={styles.footer}>
      <div className={styles.footerButtonRow}>
        <ButtonSecondary onClick={close}>Cancel</ButtonSecondary>
        <ButtonPrimary onClick={save}>Done</ButtonPrimary>
      </div>
    </div>
  );
};

export const NoModsSelectedNotice: React.FC = () => {
  return (
    <div className={styles.noMods}>
      <FontAwesomeIcon
        className={styles.noModsIcon}
        icon={["fas", "ice-cream"]}
      />
      <p className={styles.noModsText}>
        Vanilla is good, but we want none of that here.
      </p>
      <p className={styles.noModsText}>Add some mods!</p>
    </div>
  );
};

interface ModSelectorProps extends Closable {
  allMods: ModPackage[];
  currentlySelected: ModPackage[];
  setCurrentlySelected: Dispatch<SetStateAction<ModPackage[]>>;
  visible: boolean;
}

export const ModSelectorModal: React.FC<ModSelectorProps> = (props) => {
  const { allMods, close, currentlySelected, setCurrentlySelected, visible } =
    props;

  // Changes done in the modal are temporary until user clicks "Done".
  const [tempSelected, setTempSelected] = useState(currentlySelected);

  const selectableMods = useMemo(() => {
    return allMods.filter((x) => !tempSelected.find((y) => y.id == x.id));
  }, [allMods, tempSelected]);

  const selectMod: (selection: ModPackage) => void = useMemo(() => {
    return (selection: ModPackage) => {
      if (selectableMods.find((x) => x.id == selection.id)) {
        setTempSelected((current) => [...current, selection]);
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
};
