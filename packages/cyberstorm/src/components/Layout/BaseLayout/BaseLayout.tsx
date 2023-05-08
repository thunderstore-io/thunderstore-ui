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
  leftSidebarContent?: ReactElement;
  rightSidebarContent?: ReactElement;
}

export function BaseLayout(props: BaseLayoutProps) {
  const {
    backGroundImageSource,
    breadCrumb,
    header,
    mainContent,
    search,
    tabs,
    leftSidebarContent,
    rightSidebarContent,
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
          {header ? (
            <header className={styles.pageHeader}>{header}</header>
          ) : null}
          <section className={styles.pageBody}>
            {tabs ? <nav>{tabs}</nav> : null}
            <div>
              <div className={styles.layoutSidebar}>
                {search ? (
                  <div className={styles.fullWidth}>{search}</div>
                ) : null}
                {leftSidebarContent ? (
                  <aside className={styles.sidebar}>{leftSidebarContent}</aside>
                ) : null}
                <main className={styles.main}>{mainContent}</main>
                {rightSidebarContent ? (
                  <aside className={styles.sidebar}>
                    {rightSidebarContent}
                  </aside>
                ) : null}
              </div>
            </div>
          </section>
        </div>
      </section>
      <Footer />
    </div>
  );
}
