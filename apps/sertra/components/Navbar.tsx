import Link from "next/link";
import { FC, PropsWithChildren } from "react";

import Logo from "/public/ts-logo.svg";
import styles from "./Navbar.module.css";

export const Navbar: FC<PropsWithChildren> = () => (
  <nav className={styles.navbar}>
    <h1>
      <Logo />
      Thunderstore
    </h1>
    <Link href={"/"}>Servers</Link>
    <Link href={"/create"}>Submit Server</Link>
  </nav>
);
