import React, { ReactPortal, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { useGoogleMap, useGoogleMapsAPI } from "../context/GoogleMapsContext";

export interface CustomControlProps {
  /**
   * Content of control.
   */
  children: React.ReactNode;

  /**
   * Position id. Used to specify the position of the control on the map.
   */
  position: keyof typeof google.maps.ControlPosition;
}

export function CustomControl({
  children,
  position,
}: CustomControlProps): ReactPortal {
  const map = useGoogleMap();
  const maps = useGoogleMapsAPI();
  const node = useRef(document.createElement("div"));
  const controlPosition = maps.ControlPosition[position];

  useEffect(() => {
    const controls = map.controls[controlPosition];

    controls.push(node.current);

    return () => {
      const idx = controls.getArray().indexOf(node.current);

      if (idx !== -1) {
        controls.removeAt(idx);
      }
    };
  }, [controlPosition]);

  return createPortal(children, node.current);
}
