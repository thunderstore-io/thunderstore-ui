import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";

import { useCompleteLogin } from "hooks/useCompleteLogin";
import { ContentWrapper } from "components/Wrapper";
import { isProvider, Provider } from "utils/oauth";
import { getString } from "utils/urlQuery";

interface PageProps {
  code: string | null;
  provider: Provider;
  state: string | null;
}

function loginPage(props: PageProps): JSX.Element | null {
  const { code, provider, state } = props;

  if (code === null) {
    throw new Error('AuthError: missing required parameter "code"');
  }

  if (state === null) {
    throw new Error('AuthError: missing required parameter "state"');
  }

  useCompleteLogin(provider, code, state);

  return (
    <ContentWrapper>
      <p>Processing login request...</p>
    </ContentWrapper>
  );
}

// Prevent SSR since localstorage is not available on server-side.
export default dynamic(() => Promise.resolve(loginPage), {
  ssr: false,
});

export const getServerSideProps: GetServerSideProps = async (context) => {
  const provider = getString(context.params?.provider);

  if (!isProvider(provider)) {
    return { notFound: true };
  }

  return {
    props: {
      code: getString(context.query.code) || null,
      provider,
      state: getString(context.query.state) || null,
    },
  };
};
