import { createContext, useContext } from "react";

export const GoogleMapsAPIContext = createContext<null | typeof google.maps>(
  null,
);

export const GoogleMapContext = createContext<null | google.maps.Map>(null);

export const GoogleMapMarkerContext = createContext<null | google.maps.Marker>(
  null,
);

export function useGoogleMapsAPI(): typeof google.maps {
  const maps = useContext(GoogleMapsAPIContext);

  if (!maps) {
    throw new Error(
      "Could not find 'maps' in the context. " +
        "Wrap the root component in an <GoogleMapsAPIContext.Provider>.",
    );
  }

  return maps;
}

export function useGoogleMap(): google.maps.Map {
  const map = useContext(GoogleMapContext);

  if (!map) {
    throw new Error(
      "Could not find 'map' in the context. " +
        "Wrap the root component in an <Map>.",
    );
  }

  return map;
}

export function useGoogleMapMarker(): google.maps.Marker {
  const marker = useContext(GoogleMapMarkerContext);

  if (!marker) {
    throw new Error(
      "Could not find 'marker' in the context. " +
        "Wrap the root component in an <Marker>.",
    );
  }

  return marker;
}
