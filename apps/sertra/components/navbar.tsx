import { FC, PropsWithChildren } from "react";

export const Navbar: FC<PropsWithChildren> = () => {
  return (
    <div style={{ width: "1140px", marginLeft: "auto", marginRight: "auto" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingTop: "20px",
          fontFamily: "Raleway",
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
          Servers
        </div>
        <div
          style={{
            marginLeft: "20px",
            marginRight: "20px",
            color: "white",
            fontSize: "16px",
          }}
        >
          Submit Server
        </div>
      </div>
    </div>
  );
};
