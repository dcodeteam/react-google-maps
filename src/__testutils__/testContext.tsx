import React, { ComponentType } from "react";

import {
  GoogleMapContext,
  GoogleMapMarkerContext,
  GoogleMapsAPIContext,
} from "../context/GoogleMapsContext";
import { mockMaps } from "./mockMaps";

interface MapMockContext {
  readonly map: google.maps.Map;
  readonly maps: typeof google.maps;
}

function createMapMockContext(): MapMockContext {
  const maps = mockMaps();

  return { maps, map: new maps.Map(null) };
}

export function initMapMockComponent<P>(
  Component: ComponentType<P>,
): [ComponentType<P>, MapMockContext] {
  const ctx = createMapMockContext();

  function Mock(props: P) {
    return (
      <GoogleMapsAPIContext.Provider value={ctx.maps}>
        <GoogleMapContext.Provider value={ctx.map}>
          <Component {...props} />
        </GoogleMapContext.Provider>
      </GoogleMapsAPIContext.Provider>
    );
  }

  beforeEach(() => {
    Object.assign(ctx, createMapMockContext());
  });

  return [Mock, ctx];
}

interface MarkerMockContext extends MapMockContext {
  readonly marker: google.maps.Marker;
}

function creatMarkerMockContext(): MarkerMockContext {
  const maps = mockMaps();

  return { maps, map: new maps.Map(null), marker: new maps.Marker() };
}

export function initMapMarkerMockComponent<P>(
  Component: ComponentType<P>,
): [ComponentType<P>, MarkerMockContext] {
  const ctx = creatMarkerMockContext();

  function Mock(props: P) {
    return (
      <GoogleMapsAPIContext.Provider value={ctx.maps}>
        <GoogleMapContext.Provider value={ctx.map}>
          <GoogleMapMarkerContext.Provider value={ctx.marker}>
            <Component {...props} />
          </GoogleMapMarkerContext.Provider>
        </GoogleMapContext.Provider>
      </GoogleMapsAPIContext.Provider>
    );
  }

  beforeEach(() => {
    Object.assign(ctx, creatMarkerMockContext());
  });

  return [Mock, ctx];
}
