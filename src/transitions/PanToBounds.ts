import { useEffect } from "react";

import { useGoogleMap, useGoogleMapsAPI } from "../context/GoogleMapsContext";
import { createLatLngBounds } from "../internal/MapsUtils";
import { useDeepCompareMemo } from "../internal/useDeepCompareMemo";

export interface PanToBoundsProps {
  /**
   * Rectangle from the points at its south-west and north-east corners.
   */
  bounds: google.maps.LatLngBoundsLiteral;
}

export function PanToBounds({ bounds }: PanToBoundsProps): null {
  const map = useGoogleMap();
  const maps = useGoogleMapsAPI();
  const latLngBounds = useDeepCompareMemo(
    () => createLatLngBounds(maps, bounds),
    [bounds],
  );

  useEffect(() => {
    map.panToBounds(latLngBounds);
  }, [latLngBounds]);

  return null;
}
