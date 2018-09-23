import * as React from "react";

import { GoogleMapContextConsumer } from "../google-map-context/GoogleMapContext";
import { isShallowEqualProps } from "../internal/PropsUtils";
import { ValueSpy } from "../internal/ValueSpy";

export interface FitBoundsProps {
  /**
   * Array of positions that will be used to generate `LatLngBounds` object.
   *
   * See also: [google.maps.LatLngBounds](https://developers.google.com/maps/documentation/javascript/3.exp/reference#LatLngBounds)
   */
  latLngBounds: google.maps.LatLngBoundsLiteral;
}

/**
 * Sets the `viewport` to contain the given `bounds`.
 *
 * **Usage:**
 *
 * ```javascript
 * import React from "react";
 * import { GoogleMap, FitBounds } from "react-google-map-components"
 *
 * export default function GoogleMapWrapper(props) {
 *   return (
 *     <GoogleMap {...props} maps={google.maps}>
 *       <FitBounds latLngBounds={props.bounds} />
 *     </GoogleMap>
 *   );
 * }
 * ```
 *
 * **Google Maps Docs:**
 * * [google.maps.Map](https://developers.google.com/maps/documentation/javascript/reference#Map)
 */
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
              if (!isShallowEqualProps(latLngBounds, prevValue)) {
                fitBounds();
              }
            }}
          />
        );
      }}
    </GoogleMapContextConsumer>
  );
}
