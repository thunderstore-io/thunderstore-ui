import { FC, PropsWithChildren } from "react";
import Link from "next/link";

export const Navbar: FC<PropsWithChildren> = () => {
  return (
    <div style={{ width: "1140px", marginLeft: "auto", marginRight: "auto" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingTop: "20px",
          fontFamily: "var(--font-family-header)",
        }}
      >
        <h1 style={{ flex: 1, color: "white", fontSize: "16px" }}>
          Thunderstore
        </h1>
        <div
          style={{
            marginLeft: "20px",
            marginRight: "20px",
            color: "white",
            fontSize: "16px",
          }}
        >
          <Link href={"/"}>Servers</Link>
        </div>
        <div
          style={{
            marginLeft: "20px",
            marginRight: "20px",
            color: "white",
            fontSize: "16px",
          }}
        >
          <Link href={"/create"}>Submit Server</Link>
        </div>
      </div>
    </div>
  );
};
