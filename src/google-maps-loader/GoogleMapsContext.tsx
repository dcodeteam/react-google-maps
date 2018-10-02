import * as React from "react";

export interface GoogleMapsContext {
  readonly maps: typeof google.maps;
}

const {
  Consumer: PartialGoogleMapsContextConsumer,
  Provider: PartialGoogleMapsContextProvider,
} = React.createContext<Partial<GoogleMapsContext>>({});

export const GoogleMapsContextProvider = PartialGoogleMapsContextProvider as React.Provider<
  GoogleMapsContext
>;

export interface GoogleMapsContextConsumerProps {
  children: (ctx: GoogleMapsContext) => React.ReactNode;
}

export function GoogleMapsContextConsumer({
  children,
}: GoogleMapsContextConsumerProps) {
  return (
    <PartialGoogleMapsContextConsumer>
      {ctx => (!ctx.maps ? null : children(ctx as GoogleMapsContext))}
    </PartialGoogleMapsContextConsumer>
  );
}
