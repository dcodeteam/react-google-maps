import * as React from "react";

import { GoogleMapContextConsumer } from "../google-map-context/GoogleMapContext";
import { isShallowEqual } from "../internal/PropsUtils";
import { ValueSpy } from "../internal/ValueSpy";

export interface PanToBoundsProps {
  /**
   * Array of positions that will be used to generate `LatLngBounds` object.
   *
   * See also: [google.maps.LatLngBounds](https://developers.google.com/maps/documentation/javascript/3.exp/reference#LatLngBounds)
   */
  latLngBounds: google.maps.LatLngBoundsLiteral;
}

/**
 * Pans the map by the minimum amount necessary to contain the given `LatLngBounds`.
 * It makes no guarantee where on the map the bounds will be, except that as much of the
 * bounds as possible will be visible.
 *
 * The bounds will be positioned inside the area bounded by the map type and navigation
 * (pan, zoom, and Street View) controls, if they are present on the map.
 *
 * If the bounds is larger than the map, the map will be shifted to include the northwest
 * corner of the bounds.
 *
 * If the change in the map's position is less than both the width and height of the map,
 * the transition will be smoothly animated.
 *
 * **Usage:**
 *
 * ```javascript
 * import React from "react";
 * import { GoogleMap, PanToBounds } from "react-google-map-components"
 *
 * export default function GoogleMapWrapper(props) {
 *   return (
 *     <GoogleMap {...props} maps={google.maps}>
 *       <PanToBounds latLngBounds={props.bounds} />
 *     </GoogleMap>
 *   );
 * }
 * ```
 *
 * **Google Maps Docs:**
 * * [google.maps.Map](https://developers.google.com/maps/documentation/javascript/reference#Map)
 */
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
