import React from "react";

export interface ThunderstoreProviderProps {
  apiUrl: string;
}

export const ThunderstoreContext = React.createContext<ThunderstoreProviderProps>({
  apiUrl: "http://localhost/api/",
});

ThunderstoreContext.displayName = "ThunderstoreContext";

export const ThunderstoreProvider = ThunderstoreContext.Provider;
