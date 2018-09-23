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
