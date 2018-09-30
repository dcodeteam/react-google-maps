import * as React from "react";

export interface GoogleMapContext {
  readonly map: google.maps.Map;
  readonly maps: typeof google.maps;
}

const {
  Consumer: PartialGoogleMapContextConsumer,
  Provider: PartialGoogleMapContextProvider,
} = React.createContext<Partial<GoogleMapContext>>({});

export const GoogleMapContextProvider = PartialGoogleMapContextProvider as React.Provider<
  GoogleMapContext
>;

export interface GoogleMapContextConsumerProps {
  children: (ctx: GoogleMapContext) => React.ReactNode;
}

export function GoogleMapContextConsumer({
  children,
}: GoogleMapContextConsumerProps) {
  return (
    <PartialGoogleMapContextConsumer>
      {ctx =>
        !ctx.map || !ctx.maps ? null : children(ctx as GoogleMapContext)
      }
    </PartialGoogleMapContextConsumer>
  );
}
