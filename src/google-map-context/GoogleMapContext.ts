import { createContext } from "react";

export interface GoogleMapContext {
  readonly map: google.maps.Map;
  readonly maps: typeof google.maps;
}

// eslint-disable-next-line typescript/no-explicit-any
export const context = createContext<GoogleMapContext>(null as any);

export const GoogleMapContextProvider = context.Provider;
export const GoogleMapContextConsumer = context.Consumer;
