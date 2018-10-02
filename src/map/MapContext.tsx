import * as React from "react";

export interface MapContext {
  readonly map: google.maps.Map;
  readonly maps: typeof google.maps;
}

const {
  Consumer: PartialGoogleMapContextConsumer,
  Provider: PartialGoogleMapContextProvider,
} = React.createContext<Partial<MapContext>>({});

export const GoogleMapContextProvider = PartialGoogleMapContextProvider as React.Provider<
  MapContext
>;

export interface GoogleMapContextConsumerProps {
  children: (ctx: MapContext) => React.ReactNode;
}

export function GoogleMapContextConsumer({
  children,
}: GoogleMapContextConsumerProps) {
  return (
    <PartialGoogleMapContextConsumer>
      {ctx => (!ctx.map || !ctx.maps ? null : children(ctx as MapContext))}
    </PartialGoogleMapContextConsumer>
  );
}