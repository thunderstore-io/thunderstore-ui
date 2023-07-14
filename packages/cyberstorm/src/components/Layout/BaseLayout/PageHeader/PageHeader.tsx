import styles from "./PageHeader.module.css";
import { ReactElement } from "react";
import { CollapsibleText } from "../../../CollapsibleText/CollapsibleText";
import { Title } from "../../../Title/Title";

export interface PageHeaderProps {
  image?: ReactElement;
  title: string;
  description?: string | null;
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
        <Title text={title} />

        {description ? (
          <CollapsibleText text={description} maxLength={85} />
        ) : null}
        {meta.length > 0 ? <div className={styles.meta}>{meta}</div> : null}
      </div>
    </div>
  );
}

PageHeader.displayName = "PageHeader";
