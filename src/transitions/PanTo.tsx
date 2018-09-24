import * as React from "react";

import { GoogleMapContextConsumer } from "../google-map-context/GoogleMapContext";
import { isShallowEqual } from "../internal/DataUtils";
import { ValueSpy } from "../internal/ValueSpy";

export interface PanToProps {
  /**
   * Defines the next map center position.
   */
  latLng: google.maps.LatLngLiteral;
}

export function PanTo({ latLng }: PanToProps) {
  return (
    <GoogleMapContextConsumer>
      {({ map }) => {
        if (!map) {
          return null;
        }

        const panTo = () => {
          map.panTo(latLng);
        };

        return (
          <ValueSpy
            value={latLng}
            didMount={panTo}
            didUpdate={prevValue => {
              if (!isShallowEqual(latLng, prevValue)) {
                panTo();
              }
            }}
          />
        );
      }}
    </GoogleMapContextConsumer>
  );
}
