import { useEffect } from "react";

import { useGoogleMap, useGoogleMapsAPI } from "../context/GoogleMapsContext";
import { createLatLng } from "../internal/MapsUtils";

export interface PanToProps {
  /**
   * Defines the next map center position.
   */
  position: google.maps.LatLngLiteral;
}

export function PanTo({ position: { lat, lng } }: PanToProps) {
  const map = useGoogleMap();
  const maps = useGoogleMapsAPI();
  const latLng = createLatLng(maps, { lat, lng });

  useEffect(
    () => {
      map.panTo(latLng);
    },
    [latLng.lat(), latLng.lng()],
  );

  return null;
}
