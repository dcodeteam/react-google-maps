import * as React from "react";

import { MapControl, MapControlPosition } from "./internal/MapControl";

export interface MapTypeControlProps {
  /**
   * Position id. Used to specify the position of the control on the map.
   */
  position?: MapControlPosition;

  /**
   * Style id. Used to select what style of map type control to display.
   */
  style?: "DEFAULT" | "DROPDOWN_MENU" | "HORIZONTAL_BAR";

  /**
   * IDs of map types to show in the control.
   */
  mapTypeIds?: Array<"HYBRID" | "ROADMAP" | "SATELLITE" | "TERRAIN">;
}

/**
 * Controls display options Map type control.
 *
 * **Usage:**
 *
 * ```javascript
 * import React from "react";
 * import { GoogleMap, MapTypeControl } from "react-google-map-components"
 *
 * export default function GoogleMapWrapper(props) {
 *   return (
 *     <GoogleMap {...props} maps={google.maps}>
 *       <MapTypeControl />
 *     </GoogleMap>
 *   );
 * }
 * ```
 *
 * **Google Maps Docs:**
 * * [google.maps.MapTypeControlOptions](https://developers.google.com/maps/documentation/javascript/reference#MapTypeControlOptions)
 */
export function MapTypeControl({
  position = "TOP_RIGHT",
  style = "DEFAULT",
  mapTypeIds = ["HYBRID", "ROADMAP", "SATELLITE", "TERRAIN"],
}: MapTypeControlProps) {
  return (
    <MapControl
      createControl={maps => ({
        name: "mapTypeControl",
        options: {
          style: maps.MapTypeControlStyle[style],
          position: maps.ControlPosition[position],
          mapTypeIds: mapTypeIds.map(x => x && maps.MapTypeId[x]),
        },
      })}
    />
  );
}
