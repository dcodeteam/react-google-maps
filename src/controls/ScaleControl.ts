import { useMapControl } from "./internal/useMapControl";

export function ScaleControl(): null {
  useMapControl(() => ({ name: "scaleControl" }));

  return null;
}
