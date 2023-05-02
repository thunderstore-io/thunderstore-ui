import Link from "next/link";

import Logo from "/public/ts-logo.svg";
import styles from "./Navbar.module.css";

export function Navbar() {
  return (
    <nav className={styles.navbar}>
      <h1>
        <Logo />
        Thunderstore
      </h1>
      <Link href={"/"}>Servers</Link>
      <Link href={"/create"}>Submit Server</Link>
    </nav>
  );
}
