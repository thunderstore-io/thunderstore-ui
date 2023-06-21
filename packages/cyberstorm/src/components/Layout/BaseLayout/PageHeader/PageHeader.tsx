import styles from "./PageHeader.module.css";
import { Title } from "../../../Title/Title";
import { ReactElement } from "react";
import { CollapsibleText } from "../../../CollapsibleText/CollapsibleText";

export interface PageHeaderProps {
  image?: ReactElement;
  title: string;
  description?: string;
  meta?: ReactElement[];
}

/**
 * Cyberstorm PageHeader
 */
export function PageHeader(props: PageHeaderProps) {
  const { title, description = null, image = null, meta = [] } = props;

  return (
    <div className={styles.root}>
      {image ? <div className={styles.image}>{image}</div> : null}
      <div className={styles.info}>
        <div className={styles.title}>{title}</div>

        {description ? (
          <CollapsibleText text={description} maxLength={85} />
        ) : null}
        {meta.length > 0 ? <div className={styles.meta}>{meta}</div> : null}
      </div>
    </div>
  );
}

PageHeader.displayName = "PageHeader";
