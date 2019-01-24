import { useMapControl } from "./internal/useMapControl";

export interface MapTypeControlProps {
  /**
   * Position id. Used to specify the position of the control on the map.
   */
  position?: keyof typeof google.maps.ControlPosition;

  /**
   * Style id. Used to select what style of map type control to display.
   */
  style?: "DEFAULT" | "DROPDOWN_MENU" | "HORIZONTAL_BAR";

  /**
   * IDs of map types to show in the control.
   */
  mapTypeIds?: Array<keyof typeof google.maps.MapTypeId>;
}

export function MapTypeControl({
  position = "TOP_RIGHT",
  style = "DEFAULT",
  mapTypeIds = ["HYBRID", "ROADMAP", "SATELLITE", "TERRAIN"],
}: MapTypeControlProps): null {
  useMapControl(maps => ({
    name: "mapTypeControl",
    options: {
      style: maps.MapTypeControlStyle[style],
      position: maps.ControlPosition[position],
      mapTypeIds: mapTypeIds.map(x => x && maps.MapTypeId[x]),
    },
  }));

  return null;
}
