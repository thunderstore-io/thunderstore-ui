import { NextPage } from "next";
import dynamic from "next/dynamic";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { FC, PropsWithChildren, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "@tanstack/react-query";
import axios from "axios";
import { ApiURLs } from "../api/urls";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface LoginPageProps {}

interface InitParams {
  account_id: string;
}

interface InitResponse {
  request_id: string;
  payload: string;
}

interface CompleteParams {
  request_id: string;
  signature: string;
}

interface CompleteResponse {
  auth_token: string;
}

export default dynamic(() => Promise.resolve(LoginPage), {
  ssr: false,
});

const useEthereum = (): MetaMaskInpageProvider | undefined => {
  return window.ethereum;
};

const buttonStyle = {
  padding: "10px",
  borderRadius: "12px",
  fontSize: "18px",
  fontWeight: "900",
  cursor: "pointer",
  fontFamily: "Exo2",
  color: "#17213B",
  backgroundColor: "#eeeeee",
  borderColor: "#ffffff",
};

interface LoginProps {
  ethereum: MetaMaskInpageProvider;
}
const LoginWithEthereum: FC<PropsWithChildren<LoginProps>> = ({ ethereum }) => {
  const completeMutation = useMutation<
    CompleteResponse,
    unknown,
    CompleteParams
  >(async (payload) => {
    const request = await axios.post(ApiURLs.AuthWeb3Complete, payload);
    return request.data;
  });

  const [account, setAccount] = useState<string | undefined>(undefined);
  function connect() {
    ethereum
      .request({ method: "eth_requestAccounts" })
      .then((result) => {
        const accounts = result as any as string[];
        console.log(accounts);
        setAccount(accounts[0]);
      })
      .catch((error) => {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          console.log("Please connect to MetaMask.");
        } else {
          console.error(error);
        }
      });
  }

  async function sign(accountId: string, message: string): Promise<string> {
    return (await ethereum.request({
      method: "personal_sign",
      params: [message, accountId],
    })) as any as string;
  }

  async function signIn(accountId: string) {
    const session = await axios.post<InitResponse>(ApiURLs.AuthWeb3Init, {
      account_id: accountId,
    });
    const signature = await sign(accountId, session.data.payload);
    completeMutation.mutate({
      request_id: session.data.request_id,
      signature: signature,
    });
  }

  const isSubmitted =
    completeMutation.isLoading ||
    completeMutation.isSuccess ||
    completeMutation.isError;

  return (
    <div style={{ paddingBottom: "600px" }}>
      {!isSubmitted && <p>Sign in using MetaMask</p>}
      {completeMutation.isLoading && <p>Loading...</p>}
      {!isSubmitted &&
        (account !== undefined ? (
          <button style={buttonStyle} onClick={() => signIn(account)}>
            Sign in
          </button>
        ) : (
          <button style={buttonStyle} onClick={connect}>
            Connect wallet
          </button>
        ))}
      {completeMutation.isSuccess && (
        <div>
          <p>Successfull authorization!</p>
          <p>Auth token received: {completeMutation.data.auth_token}</p>
        </div>
      )}
      {completeMutation.isError && (
        <div>
          <p>Error encountered</p>
        </div>
      )}
    </div>
  );
};

const EthereumNotAvailable = () => {
  return <div>Wallet not found</div>;
};

const LoginPage: NextPage<LoginPageProps> = () => {
  const ethereum = useEthereum();
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <h1>Login</h1>
        {ethereum !== undefined ? (
          <LoginWithEthereum ethereum={ethereum} />
        ) : (
          <EthereumNotAvailable />
        )}
      </div>
    </QueryClientProvider>
  );
};
