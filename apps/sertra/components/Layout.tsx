import { FC, PropsWithChildren } from "react";

import { Footer } from "./Footer";
import styles from "./Layout.module.css";
import { Navbar } from "./Navbar";

export const Layout: FC<PropsWithChildren> = (props) => (
  <>
    <Navbar />
    <main className={styles.main}>{props.children}</main>
    <Footer />
  </>
);
