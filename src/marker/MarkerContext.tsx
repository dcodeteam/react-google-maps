import * as React from "react";

export interface MarkerContext {
  marker?: google.maps.Marker;
}

const { Consumer, Provider } = React.createContext<MarkerContext>({});

export const MarkerContextConsumer = Consumer;
export const MarkerContextProvider = Provider;
