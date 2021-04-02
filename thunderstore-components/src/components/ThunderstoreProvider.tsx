import React from "react";

export interface ThunderstoreProviderProps {
  apiUrl: string;
}

export const ThunderstoreContext = React.createContext<ThunderstoreProviderProps>({
  apiUrl: "https://thunderstore.io/api/",
});

ThunderstoreContext.displayName = "ThunderstoreContext";

export const ThunderstoreProvider = ThunderstoreContext.Provider;
