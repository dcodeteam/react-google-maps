import * as React from "react";

import { GoogleMapContextConsumer } from "../google-map-context/GoogleMapContext";
import { isShallowEqual } from "../internal/DataUtils";
import { ValueSpy } from "../internal/ValueSpy";

export interface FitBoundsProps {
  /**
   * Rectangle from the points at its south-west and north-east corners.
   */
  latLngBounds: google.maps.LatLngBoundsLiteral;
}

export function FitBounds({ latLngBounds }: FitBoundsProps) {
  return (
    <GoogleMapContextConsumer>
      {({ map }) => {
        if (!map) {
          return null;
        }

        const fitBounds = () => {
          map.fitBounds(latLngBounds);
        };

        return (
          <ValueSpy
            value={latLngBounds}
            didMount={fitBounds}
            didUpdate={prevValue => {
              if (!isShallowEqual(latLngBounds, prevValue)) {
                fitBounds();
              }
            }}
          />
        );
      }}
    </GoogleMapContextConsumer>
  );
}
