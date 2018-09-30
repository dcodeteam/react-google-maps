import * as React from "react";

export interface MarkerContext {
  marker: google.maps.Marker;
}

const {
  Consumer: PartialMarkerContextConsumer,
  Provider: PartialMarkerContextProvider,
} = React.createContext<Partial<MarkerContext>>({});

export const MarkerContextProvider = PartialMarkerContextProvider as React.Provider<
  MarkerContext
>;

export interface MarkerContextConsumerProps {
  children: (ctx: MarkerContext) => React.ReactNode;
}

export function MarkerContextConsumer({
  children,
}: MarkerContextConsumerProps) {
  return (
    <PartialMarkerContextConsumer>
      {ctx => (!ctx.marker ? null : children(ctx as MarkerContext))}
    </PartialMarkerContextConsumer>
  );
}
