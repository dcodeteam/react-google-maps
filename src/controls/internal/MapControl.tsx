import * as React from "react";

import { MapComponent } from "../../google-map-component/MapComponent";
import { GoogleMapContext } from "../../google-map-context/GoogleMapContext";
import { isDeepEqual } from "../../internal/DataUtils";

export type MapControlPosition =
  | "BOTTOM_CENTER"
  | "BOTTOM_LEFT"
  | "BOTTOM_RIGHT"
  | "LEFT_BOTTOM"
  | "LEFT_CENTER"
  | "LEFT_TOP"
  | "RIGHT_BOTTOM"
  | "RIGHT_CENTER"
  | "RIGHT_TOP"
  | "TOP_CENTER"
  | "TOP_LEFT"
  | "TOP_RIGHT";

interface Control<N extends keyof google.maps.MapOptions, O = never> {
  name: N;
  options?: O;
}

type ControlVariant =
  | Control<"fullscreenControl", google.maps.FullscreenControlOptions>
  | Control<"mapTypeControl", google.maps.MapTypeControlOptions>
  | Control<"rotateControl", google.maps.RotateControlOptions>
  | Control<"scaleControl">
  | Control<"streetViewControl", google.maps.StreetViewControlOptions>
  | Control<"zoomControl", google.maps.ZoomControlOptions>;

export interface MapControlProps {
  createControl: (maps: typeof google.maps) => ControlVariant;
}

function createMapOptions(visible: boolean, control: ControlVariant) {
  return {
    [control.name]: visible,
    [`${control.name}Options`]: !visible ? undefined : control.options,
  };
}

export function MapControl({ createControl }: MapControlProps) {
  return (
    <MapComponent
      createOptions={({ maps }: GoogleMapContext) => createControl(maps)}
      didMount={({ map, options }) => {
        map.setOptions(createMapOptions(true, options));
      }}
      didUpdate={({ options: prevOptions }, { options: nextOptions, map }) => {
        if (!isDeepEqual(prevOptions, nextOptions)) {
          map.setOptions(createMapOptions(true, nextOptions));
        }
      }}
      willUnmount={({ map, options }) => {
        map.setOptions(createMapOptions(false, options));
      }}
    />
  );
}
