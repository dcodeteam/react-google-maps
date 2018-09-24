import * as React from "react";

import { MapControl } from "./internal/MapControl";

export function ScaleControl() {
  return <MapControl createControl={() => ({ name: "scaleControl" })} />;
}
