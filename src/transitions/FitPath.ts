import { useEffect } from "react";

import { useGoogleMap, useGoogleMapsAPI } from "../context/GoogleMapsContext";
import { pathToLatLngBounds } from "../internal/MapsUtils";
import { useDeepCompareMemo } from "../internal/useDeepCompareMemo";

export interface FitPathProps {
  /**
   * Array of positions that will be used to generate `LatLngBounds` object.
   */
  path: Array<google.maps.LatLngLiteral>;
}

export function FitPath({ path }: FitPathProps): null {
  const map = useGoogleMap();
  const maps = useGoogleMapsAPI();
  const latLngBounds = useDeepCompareMemo(
    () => pathToLatLngBounds(maps, path),
    [path],
  );

  useEffect(() => {
    map.fitBounds(latLngBounds);
  }, [latLngBounds]);

  return null;
}
