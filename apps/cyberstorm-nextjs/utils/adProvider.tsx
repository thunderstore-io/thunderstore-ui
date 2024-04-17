"use client";

import React from "react";

export const AdContext = React.createContext(false);
AdContext.displayName = "AdContenxt";

export const AdProvider = AdContext.Provider;
