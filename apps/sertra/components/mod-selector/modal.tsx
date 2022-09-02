import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PropsWithChildren, useMemo, useState } from "react";

import { ButtonPrimary, ButtonSecondary } from "./button";
import { MockPackages, ModPackage } from "./data";
import { IconButton } from "./iconButton";
import { ModListRow } from "./list";
import styles from "./modal.module.css";
import { SearchBox } from "./search";

interface ModalHeaderProps {
  title?: string;
  enableCloseButton?: boolean;
}
export const ModalHeader: React.FC<PropsWithChildren<ModalHeaderProps>> = ({
  children,
  title,
  enableCloseButton = true,
}) => {
  return (
    <div className={styles.header}>
      <div className={styles.headerTitle}>
        <div>{title && <h2>{title}</h2>}</div>
        <div>{enableCloseButton && <IconButton content={"X"} />}</div>
      </div>
      {children && <div className={styles.headerContent}>{children}</div>}
    </div>
  );
};

export const ModalContent: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className={styles.content}>{children}</div>;
};

export const ModalFooter: React.FC<unknown> = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.footerButtonRow}>
        <ButtonSecondary>Cancel</ButtonSecondary>
        <ButtonPrimary>Done</ButtonPrimary>
      </div>
    </div>
  );
};

export const NoModsSelectedNotice: React.FC<unknown> = () => {
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

export const ModSelectorModal = () => {
  const [selectedMods, setSelectedMods] = useState<ModPackage[]>([]);

  const selectableMods: ModPackage[] = useMemo(() => {
    return MockPackages.filter((x) => !selectedMods.find((y) => y.id == x.id));
  }, [selectedMods]);

  const selectMod: (selection: ModPackage) => void = useMemo(() => {
    return (selection: ModPackage) => {
      if (selectableMods.find((x) => x.id == selection.id)) {
        setSelectedMods(selectedMods.concat([selection]));
      }
    };
  }, [selectableMods, selectedMods, setSelectedMods]);

  const deselectMod: (selection: ModPackage) => void = useMemo(() => {
    return (selection: ModPackage) => {
      if (selectedMods.find((x) => x.id == selection.id)) {
        setSelectedMods(selectedMods.filter((y) => y.id != selection.id));
      }
    };
  }, [selectedMods, setSelectedMods]);

  return (
    <div className={styles.modal}>
      <ModalHeader title={"Mods"}>
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
        {!selectedMods.length && <NoModsSelectedNotice />}
        {!!selectedMods.length &&
          selectedMods.map((data) => {
            return (
              <ModListRow
                key={data.id}
                modPackage={data}
                showControls={true}
                onDelete={deselectMod}
              />
            );
          })}
      </ModalContent>
      <ModalFooter />
    </div>
  );
};
