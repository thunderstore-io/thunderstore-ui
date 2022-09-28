import Head from "next/head";

interface HeadProps {
  metaTitle: string;
  metaDescription: string;
}

export const HeadWrapper: React.FC<HeadProps> = ({
  metaTitle,
  metaDescription,
}) => (
  <Head>
    <title>{`${metaTitle} | Thunderstore`}</title>
    <meta key="og:title" property="og:title" content={metaTitle} />
    <meta
      key="og:description"
      property="og:description"
      content={metaDescription}
    />
  </Head>
);
