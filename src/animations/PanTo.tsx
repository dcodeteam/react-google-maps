import * as React from "react";

import { GoogleMapContextConsumer } from "../google-map-context/GoogleMapContext";
import { isShallowEqual } from "../internal/PropsUtils";
import { ValueSpy } from "../internal/ValueSpy";

export interface PanToProps {
  /**
   * Defines the next map center position.
   */
  latLng: google.maps.LatLngLiteral;
}

/**
 * Changes the center of the map to the given `latLng`.
 *
 * If the change is less than both the width and height of the map,
 * the transition will be smoothly animated.
 *
 * **Usage:**
 *
 * ```javascript
 * import React from "react";
 * import { GoogleMap, PanTo } from "react-google-map-components"
 *
 * export default function GoogleMapWrapper(props) {
 *   return (
 *     <GoogleMap {...props} maps={google.maps}>
 *       <PanTo latLng={props.panPosition} />
 *     </GoogleMap>
 *   );
 * }
 * ```
 *
 * **Google Maps Docs:**
 * * [google.maps.Map](https://developers.google.com/maps/documentation/javascript/reference#Map)
 */
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
