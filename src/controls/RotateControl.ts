import { useMapControl } from "./internal/useMapControl";

export interface RotateControlProps {
  /**
   * Position id. Used to specify the position of the control on the map.
   */
  position?: keyof typeof google.maps.ControlPosition;
}

export function RotateControl({ position = "TOP_LEFT" }: RotateControlProps) {
  useMapControl(maps => ({
    name: "rotateControl",
    options: { position: position && maps.ControlPosition[position] },
  }));

  return null;
}
