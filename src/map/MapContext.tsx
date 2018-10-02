import * as React from "react";

export interface MapContext {
  readonly map: google.maps.Map;
  readonly maps: typeof google.maps;
}

const {
  Consumer: PartialMapContextConsumer,
  Provider: PartialMapContextProvider,
} = React.createContext<Partial<MapContext>>({});

export const MapContextProvider = PartialMapContextProvider as React.Provider<
  MapContext
>;

export interface MapContextConsumerProps {
  children: (ctx: MapContext) => React.ReactNode;
}

export function MapContextConsumer({ children }: MapContextConsumerProps) {
  return (
    <PartialMapContextConsumer>
      {ctx => (!ctx.map || !ctx.maps ? null : children(ctx as MapContext))}
    </PartialMapContextConsumer>
  );
}
