import * as React from "react";

import { isShallowEqual } from "../internal/DataUtils";
import { pathToLatLngBounds } from "../internal/MapsUtils";
import { MapComponent, MapContext } from "..";

export interface PanToPathProps {
  /**
   * Array of positions that will be used to generate `LatLngBounds` object.
   */
  path: google.maps.LatLngLiteral[];
}

export function PanToPath(props: PanToPathProps) {
  return (
    <MapComponent
      createOptions={({ maps }: MapContext) =>
        pathToLatLngBounds(maps, props.path)
      }
      didMount={({ map, options }) => {
        map.panToBounds(options);
      }}
      didUpdate={({ options: prevOptions }, { options: nextOptions, map }) => {
        if (!isShallowEqual(prevOptions, nextOptions)) {
          map.panToBounds(nextOptions);
        }
      }}
    />
  );
}
