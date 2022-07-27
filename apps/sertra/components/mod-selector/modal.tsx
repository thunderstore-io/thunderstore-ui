import { PropsWithChildren } from "react";
import styles from "./modal.module.css";
import { SearchBox } from "./search";
import { ModListRow } from "./list";
import { MockPackages } from "./data";
import { IconButton } from "./iconButton";
import { ButtonPrimary, ButtonSecondary } from "./button";

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

export const ModSelectorModal = () => {
  return (
    <div className={styles.modal}>
      <ModalHeader title={"Mods"}>
        <SearchBox placeholder={"Search mods..."} />
      </ModalHeader>
      <ModalContent>
        {MockPackages.map((data) => {
          return <ModListRow key={data.id} {...data} />;
        })}
      </ModalContent>
      <ModalFooter />
    </div>
  );
};
