import { CollapsibleText, Title } from "@thunderstore/cyberstorm";
import styles from "./PageHeader.module.css";
import { ReactElement } from "react";

export interface PageHeaderProps {
  image?: ReactElement;
  title: string;
  description?: string | null;
  meta?: (ReactElement | null)[];
}

/**
 * Cyberstorm PageHeader
 */
export function PageHeader(props: PageHeaderProps) {
  const { title, description = null, image = null, meta = [] } = props;
  const metas = meta.filter(Boolean);

  return (
    <div className={styles.root}>
      {image ? <div className={styles.image}>{image}</div> : null}
      <div className={styles.info}>
        <Title text={title} />
        {description ? (
          <CollapsibleText text={description} maxLength={85} />
        ) : null}

        {metas.length ? <div className={styles.meta}>{metas}</div> : null}
      </div>
    </div>
  );
}

PageHeader.displayName = "PageHeader";
