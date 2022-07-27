import { PropsWithChildren } from "react";
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
        <div>
          {enableCloseButton && (
            <button className={styles.headerCloseButton}>X</button>
          )}
        </div>
      </div>
      {children && <div className={styles.headerContent}>{children}</div>}
    </div>
  );
};

export const ModSelectorModal = () => {
  return (
    <div className={styles.modal}>
      <ModalHeader title={"Mods"}>
        <SearchBox placeholder={"Search mods..."} />
      </ModalHeader>
    </div>
  );
};
