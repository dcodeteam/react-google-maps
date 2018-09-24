import * as React from "react";

import { GoogleMapContextConsumer } from "../google-map-context/GoogleMapContext";
import { isShallowEqual } from "../internal/DataUtils";
import { ValueSpy } from "../internal/ValueSpy";

export interface PanToBoundsProps {
  /**
   * Rectangle from the points at its south-west and north-east corners.
   */
  latLngBounds: google.maps.LatLngBoundsLiteral;
}

export function PanToBounds({ latLngBounds }: PanToBoundsProps) {
  return (
    <GoogleMapContextConsumer>
      {({ map }) => {
        if (!map) {
          return null;
        }

        const panToBounds = () => {
          map.panToBounds(latLngBounds);
        };

        return (
          <ValueSpy
            value={latLngBounds}
            didMount={panToBounds}
            didUpdate={prevValue => {
              if (!isShallowEqual(latLngBounds, prevValue)) {
                panToBounds();
              }
            }}
          />
        );
      }}
    </GoogleMapContextConsumer>
  );
}
