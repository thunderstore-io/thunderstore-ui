import styles from "./BaseLayout.module.css";
import { BackgroundImage } from "../../BackgroundImage/BackgroundImage";
import { Heading } from "../../Heading/Heading";
import { Footer } from "../../Footer/Footer";
import { ReactElement } from "react";

export interface BaseLayoutProps {
  backGroundImageSource?: string;
  breadCrumb?: ReactElement;
  header?: ReactElement;
  mainContent?: ReactElement;
  search?: ReactElement;
  tabs?: ReactElement;
  sidebarContent?: ReactElement;
}

export function BaseLayout(props: BaseLayoutProps) {
  const {
    backGroundImageSource,
    breadCrumb,
    header,
    mainContent,
    search,
    tabs,
    sidebarContent,
  } = props;

  return (
    <div className={styles.root}>
      {backGroundImageSource ? (
        <BackgroundImage src={backGroundImageSource} />
      ) : null}
      <Heading />
      <section className={styles.content}>
        <div className={styles.container}>
          <div>{breadCrumb}</div>
          <header className={styles.pageHeader}>{header}</header>
          <section className={styles.pageBody}>
            <nav>{tabs}</nav>
            <div>
              <div className={styles.layoutSidebar}>
                <div className={styles.fullWidth}>{search}</div>
                {sidebarContent ? (
                  <aside className={styles.sidebar}>{sidebarContent}</aside>
                ) : null}
                <main className={styles.main}>{mainContent}</main>
              </div>
            </div>
          </section>
        </div>
      </section>
      <Footer />
    </div>
  );
}
