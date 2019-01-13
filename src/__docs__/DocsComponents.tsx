import React, { ReactNode } from "react";

import { Omit } from "../internal/DataUtils";
import { Map, MapProps } from "../map/Map";
import { useGoogleMapsLoader } from "../use-google-maps-loader/useGoogleMapsLoader";
import { GoogleMapsAPIContext } from "../context/GoogleMapsContext";

export function DocsAPIProvider(props: { children: ReactNode }) {
  const { maps } = useGoogleMapsLoader(process.env.DOCZ_MAPS_API_KEY!);

  if (!maps) {
    return null;
  }

  return <GoogleMapsAPIContext.Provider {...props} value={maps} />;
}

interface DocsMapProps extends Omit<MapProps, "center"> {
  readonly center?: google.maps.LatLngLiteral;
}

export function DocsMap({
  zoom = 8,
  style = { height: "320px" },
  center = { lat: 36, lng: -122 },

  ...props
}: DocsMapProps) {
  return (
    <DocsAPIProvider>
      <Map {...props} zoom={zoom} style={style} center={center} />
    </DocsAPIProvider>
  );
}
