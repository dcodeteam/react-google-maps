import * as React from "react";

export interface MarkerContext {
  marker: google.maps.Marker;
}

const { Consumer, Provider } = React.createContext<Partial<MarkerContext>>({});

interface MarkerContextProviderProps {
  value: MarkerContext;
  children: React.ReactNode;
}

export class MarkerContextProvider extends React.PureComponent<
  MarkerContextProviderProps
> {
  public render() {
    return <Provider {...this.props} />;
  }
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
