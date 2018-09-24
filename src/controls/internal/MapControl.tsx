import * as React from "react";

import { GoogleMapContextConsumer } from "../../google-map-context/GoogleMapContext";
import { isDeepEqual } from "../../internal/DataUtils";
import { ValueSpy } from "../../internal/ValueSpy";

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

export interface MapControlProps {
  createControl: (
    maps: typeof google.maps,
  ) =>
    | Control<"fullscreenControl", google.maps.FullscreenControlOptions>
    | Control<"mapTypeControl", google.maps.MapTypeControlOptions>
    | Control<"rotateControl", google.maps.RotateControlOptions>
    | Control<"scaleControl">
    | Control<"streetViewControl", google.maps.StreetViewControlOptions>
    | Control<"zoomControl", google.maps.ZoomControlOptions>;
}

export function MapControl({ createControl }: MapControlProps) {
  return (
    <GoogleMapContextConsumer>
      {({ map, maps }) => {
        if (!map || !maps) {
          return null;
        }

        const control = createControl(maps);

        const setOptions = (visible: boolean) => {
          map.setOptions({
            [control.name]: visible,
            [`${control.name}Options`]:
              !visible || control.name === "scaleControl"
                ? undefined
                : control.options,
          });
        };

        const updateOptions = () => setOptions(true);
        const removeOptions = () => setOptions(false);

        return (
          <ValueSpy
            value={control}
            didMount={updateOptions}
            didUpdate={prevControl => {
              if (!isDeepEqual(control, prevControl)) {
                updateOptions();
              }
            }}
            willUnmount={removeOptions}
          />
        );
      }}
    </GoogleMapContextConsumer>
  );
}
