import React from "react";

export interface ThunderstoreProviderProps {
  apiUrl: string;
  apiToken: string | null;
}

export const ThunderstoreContext = React.createContext<ThunderstoreProviderProps>({
  apiUrl: "http://localhost/api/",
  apiToken: null,
});

ThunderstoreContext.displayName = "ThunderstoreContext";

export const ThunderstoreProvider = ThunderstoreContext.Provider;
