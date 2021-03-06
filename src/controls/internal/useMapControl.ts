import { useEffect } from "react";

import {
  useGoogleMap,
  useGoogleMapsAPI,
} from "../../context/GoogleMapsContext";
import { useDeepCompareMemo } from "../../internal/useDeepCompareMemo";

interface Control<
  TName extends keyof google.maps.MapOptions,
  TOptions = never
> {
  name: TName;
  options?: TOptions;
}

type MapControlVariant =
  | Control<"fullscreenControl", google.maps.FullscreenControlOptions>
  | Control<"mapTypeControl", google.maps.MapTypeControlOptions>
  | Control<"rotateControl", google.maps.RotateControlOptions>
  | Control<"scaleControl">
  | Control<"streetViewControl", google.maps.StreetViewControlOptions>
  | Control<"zoomControl", google.maps.ZoomControlOptions>;

export function useMapControl(
  factory: (maps: typeof google.maps) => MapControlVariant,
): void {
  const map = useGoogleMap();
  const maps = useGoogleMapsAPI();
  const { name, options } = factory(maps);
  const controlOptions = useDeepCompareMemo(() => options || {}, [options]);

  useEffect(() => {
    map.setOptions({ [name]: true, [`${name}Options`]: controlOptions });

    return () => {
      map.setOptions({ [name]: false, [`${name}Options`]: undefined });
    };
  }, [name, controlOptions]);
}
