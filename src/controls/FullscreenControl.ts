import { useMapControl } from "./internal/useMapControl";

export interface FullscreenControlProps {
  /**
   * Position id. Used to specify the position of the control on the map.
   */
  position?: keyof typeof google.maps.ControlPosition;
}

export function FullscreenControl({
  position = "RIGHT_TOP",
}: FullscreenControlProps) {
  useMapControl(maps => ({
    name: "fullscreenControl",
    options: { position: maps.ControlPosition[position] },
  }));

  return null;
}
