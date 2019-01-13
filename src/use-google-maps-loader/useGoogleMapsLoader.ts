import { useEffect, useState } from "react";

import { loadScript } from "../internal/loadScript";

const CALLBACK = "__google_maps_loader_callback__";
const CALLBACK_STACK = "__google_maps_loader_callback_stack__";
const MAPS_URL = "https://maps.googleapis.com/maps/api/js";

interface UseGoogleMapsResult {
  readonly error: boolean;
  readonly maps?: typeof google.maps;
}

function getGlobalMaps(): undefined | typeof google.maps {
  return !("google" in window) || !google ? undefined : google.maps;
}

function getStack(): Set<() => void> {
  // eslint-disable-next-line
  const global = window as any;

  if (!global[CALLBACK_STACK]) {
    global[CALLBACK_STACK] = new Set();
  }

  return global[CALLBACK_STACK];
}

function ensureCallback() {
  // eslint-disable-next-line
  const global = window as any;

  if (!global[CALLBACK]) {
    global[CALLBACK] = () => {
      const stack = getStack();

      stack.forEach(fn => fn());

      stack.clear();
    };
  }
}

function loadMaps(key: string, onSuccess: () => void): () => void {
  const stack = getStack();

  ensureCallback();

  stack.add(onSuccess);

  loadScript(
    `${MAPS_URL}?libraries=places,drawing,geometry&key=${key}&callback=${CALLBACK}`,
  );

  return () => {
    stack.delete(onSuccess);
  };
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

      return loadMaps(apiKey, () => {
        setState({ error: false, maps: getGlobalMaps() });
      });
    },
    [state.maps],
  );

  return state;
}
