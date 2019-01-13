import { useMapControl } from "./internal/useMapControl";

export function ScaleControl() {
  useMapControl(() => ({ name: "scaleControl" }));

  return null;
}
