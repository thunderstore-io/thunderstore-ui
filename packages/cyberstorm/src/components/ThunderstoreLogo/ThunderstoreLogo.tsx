import styles from "./ThunderstoreLogo.module.css";

export interface ThunderstoreLogoProps {
  src?: string;
}

/**
 * Cyberstorm ThunderstoreLogo component
 */
export function ThunderstoreLogo(props: ThunderstoreLogoProps) {
  const { src = "/images/logo.png" } = props;
  return (
    <div>
      <img className={styles.image} alt={"ThunderstoreLogo"} src={src} />
    </div>
  );
}

ThunderstoreLogo.displayName = "ThunderstoreLogo";
