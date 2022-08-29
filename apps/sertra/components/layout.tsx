import { FC, PropsWithChildren } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

export const Layout: FC<PropsWithChildren> = (props) => {
  return (
    <>
      <Navbar />
      <div style={{ width: "1140px", marginLeft: "auto", marginRight: "auto" }}>
        {props.children}
      </div>
      <Footer />
    </>
  );
};
