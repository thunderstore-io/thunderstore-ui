import { FC, PropsWithChildren } from "react";

export const Footer: FC<PropsWithChildren> = () => {
  return (
    <footer style={{ backgroundColor: "#17213B" }}>
      <div style={{ width: "1140px", marginLeft: "auto", marginRight: "auto" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            fontFamily: "Exo2",
          }}
        >
          <h2
            style={{
              flex: 1,
              fontSize: "14px",
              color: "#93A0C2",
              marginTop: "19px",
              marginBottom: "19px",
            }}
          >
            Thunderstore 2022
          </h2>
          <div
            style={{
              fontSize: "14px",
              color: "#93A0C2",
              marginTop: "19px",
              marginBottom: "19px",
            }}
          >
            <a href={"https://discord.com/invite/UWpWhjZken"}>Discord</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
