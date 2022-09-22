import Head from "next/head";

interface HeadProps {
  title: string;
  description: string;
}

export const HeadWrapper: React.FC<HeadProps> = ({ title, description }) => (
  <Head>
    <title>{title}</title>
    <meta key="og:title" property="og:title" content={title} />
    <meta
      key="og:description"
      property="og:description"
      content={description}
    />
  </Head>
);
