import styles from "./Link.module.css";

export interface LinkProps {
  label: string;
}

/**
 * Cyberstorm Link component
 */
export function Link(props: LinkProps) {
  const { label } = props;
  return <div className={styles.root}>{label}</div>;
}

Link.displayName = "Link";
Link.defaultProps = {};
