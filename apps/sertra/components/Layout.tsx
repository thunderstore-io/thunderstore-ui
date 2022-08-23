import { FC, PropsWithChildren } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

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
