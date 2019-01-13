import { useEffect, useState } from "react";

import { loadAPI } from "../internal/loadAPI";

export interface UseGoogleMapsResult {
  readonly error: boolean;
  readonly maps?: typeof google.maps;
}

function getGlobalMaps(): undefined | typeof google.maps {
  return !("google" in window) || !google ? undefined : google.maps;
}

export function useGoogleMapsLoader(apiKey: string): UseGoogleMapsResult {
  const [state, setState] = useState<UseGoogleMapsResult>({
    error: false,
    maps: getGlobalMaps(),
  });

  useEffect(
    () => {
      if (state.maps) {
        return;
      }

      return loadAPI(apiKey, () => {
        setState({ error: false, maps: getGlobalMaps() });
      });
    },
    [state.maps],
  );

  return state;
}
