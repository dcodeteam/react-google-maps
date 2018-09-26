import * as React from "react";

export interface MarkerContext {
  marker: google.maps.Marker;
}

const { Consumer, Provider } = React.createContext<Partial<MarkerContext>>({});

interface MarkerContextProviderProps {
  value: MarkerContext;
  children: React.ReactNode;
}

export function MarkerContextProvider(props: MarkerContextProviderProps) {
  return <Provider {...props} />;
}

export interface MarkerContextConsumerProps {
  children: (ctx: MarkerContext) => React.ReactNode;
}

export function MarkerContextConsumer({
  children,
}: MarkerContextConsumerProps) {
  return (
    <Consumer>
      {ctx => (!ctx.marker ? null : children(ctx as MarkerContext))}
    </Consumer>
  );
}
