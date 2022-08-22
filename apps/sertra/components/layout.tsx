import { FC, PropsWithChildren } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

export const Layout: FC<PropsWithChildren> = (props) => {
  return (
    <>
      <Navbar />
      <div
        style={{
          width: "100%",
          maxWidth: "1140px",
          margin: "0 auto",
        }}
      >
        {props.children}
      </div>
      <Footer />
    </>
  );
};
