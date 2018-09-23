import * as React from "react";

import { GoogleMapContextConsumer } from "../google-map-context/GoogleMapContext";
import { ValueSpy } from "../internal/ValueSpy";

export interface PanByProps {
  /**
   * Defines the distance to coordinate from west to east in pixels.
   */
  x: number;
  /**
   * Defines the distance to coordinate from north to south in pixels.
   */
  y: number;
}

/**
 * Changes the center of the map by the given distance in pixels.
 *
 * If the distance is less than both the width and height of the map, the transition will be smoothly animated.
 *
 * **Usage:**
 *
 * ```javascript
 * import React from "react";
 * import { GoogleMap, PanBy } from "react-google-map-components"
 *
 * export default function GoogleMapWrapper(props) {
 *   return (
 *     <GoogleMap {...props} maps={google.maps}>
 *       <PanBy x={props.panX} y={props.panY} />
 *     </GoogleMap>
 *   );
 * }
 * ```
 *
 * **Google Maps Docs:**
 * * [google.maps.Map](https://developers.google.com/maps/documentation/javascript/reference#Map)
 */
export function PanBy(props: PanByProps) {
  return (
    <GoogleMapContextConsumer>
      {({ map }) => {
        if (!map) {
          return null;
        }

        const panBy = () => {
          map.panBy(props.x, props.y);
        };

        return (
          <ValueSpy
            value={props}
            didMount={panBy}
            didUpdate={prevValue => {
              if (props.x !== prevValue.x || props.y !== prevValue.y) {
                panBy();
              }
            }}
          />
        );
      }}
    </GoogleMapContextConsumer>
  );
}
