import { useMapControl } from "./internal/useMapControl";

export interface ZoomControlProps {
  /**
   * Position id. Used to specify the position of the control on the map.
   */
  position?: keyof typeof google.maps.ControlPosition;
}

export function ZoomControl({ position = "TOP_LEFT" }: ZoomControlProps) {
  useMapControl(maps => ({
    name: "zoomControl",
    options: { position: position && maps.ControlPosition[position] },
  }));

  return null;
}
