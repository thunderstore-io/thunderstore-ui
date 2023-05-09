import { PropsWithChildren } from "react";

import { Footer } from "./Footer";
import styles from "./Layout.module.css";
import { Navbar } from "./Navbar";

export function Layout(props: PropsWithChildren) {
  return (
    <>
      <Navbar />
      <main className={styles.main}>{props.children}</main>
      <Footer />
    </>
  );
}
