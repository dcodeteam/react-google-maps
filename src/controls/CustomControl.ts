import React, { ReactPortal, useEffect } from "react";
import { createPortal } from "react-dom";

import { useGoogleMap, useGoogleMapsAPI } from "../context/GoogleMapsContext";
import { useMemoOnce } from "../internal/useMemoOnce";

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
  const node = useMemoOnce(() => document.createElement("div"));
  const controlPosition = maps.ControlPosition[position];

  useEffect(() => {
    const controls = map.controls[controlPosition];

    controls.push(node);

    return () => {
      const idx = controls.getArray().indexOf(node);

      if (idx !== -1) {
        controls.removeAt(idx);
      }
    };
  }, [controlPosition]);

  return createPortal(children, node);
}
