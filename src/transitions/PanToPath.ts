import { useEffect } from "react";

import { pathToLatLngBounds } from "../internal/MapsUtils";
import { useDeepCompareMemo } from "../internal/useDeepCompareMemo";
import { useGoogleMap, useGoogleMapsAPI } from "../context/GoogleMapsContext";

export interface PanToPathProps {
  /**
   * Array of positions that will be used to generate `LatLngBounds` object.
   */
  path: google.maps.LatLngLiteral[];
}

export function PanToPath({ path }: PanToPathProps) {
  const map = useGoogleMap();
  const maps = useGoogleMapsAPI();
  const latLngBounds = useDeepCompareMemo(
    () => pathToLatLngBounds(maps, path),
    [path],
  );

  useEffect(
    () => {
      map.panToBounds(latLngBounds);
    },
    [latLngBounds],
  );

  return null;
}
