import { useEffect } from "react";

import { useGoogleMap, useGoogleMapsAPI } from "../context/GoogleMapsContext";
import { createLatLngBounds } from "../internal/MapsUtils";
import { useDeepCompareMemo } from "../internal/useDeepCompareMemo";

export interface FitBoundsProps {
  /**
   * Rectangle from the points at its south-west and north-east corners.
   */
  bounds: google.maps.LatLngBoundsLiteral;
}

export function FitBounds({ bounds }: FitBoundsProps) {
  const map = useGoogleMap();
  const maps = useGoogleMapsAPI();
  const latLngBounds = useDeepCompareMemo(
    () => createLatLngBounds(maps, bounds),
    [bounds],
  );

  useEffect(
    () => {
      map.fitBounds(latLngBounds);
    },
    [latLngBounds],
  );

  return null;
}
