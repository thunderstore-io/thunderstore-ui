import {
  BreadCrumbs,
  MarkdownPreviewLink,
  PageHeader,
} from "@thunderstore/cyberstorm";
import rootStyles from "../../RootLayout.module.css";
import { ReactNode, Suspense } from "react";
import { PreviewSkeleton } from "./@preview/PreviewSkeleton";

export default function ManifestValidatorLayout({
  preview,
}: {
  preview: ReactNode;
}) {
  return (
    <section className={rootStyles.content}>
      <div className={rootStyles.container}>
        <>
          <BreadCrumbs>
            <MarkdownPreviewLink>Markdown Preview</MarkdownPreviewLink>
          </BreadCrumbs>
          <header className={rootStyles.pageHeader}>
            <PageHeader title="Markdown Preview" />
          </header>
          <main className={rootStyles.main}>
            <Suspense fallback={<PreviewSkeleton />}>{preview}</Suspense>
          </main>
        </>
      </div>
    </section>
  );
}