import React, { ComponentType, ReactElement } from "react";

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

export function initMapMockComponent<TProps>(
  Component: ComponentType<TProps>,
): [ComponentType<TProps>, MapMockContext] {
  const ctx = createMapMockContext();

  function Mock(props: TProps): ReactElement<object> {
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

export function initMapMarkerMockComponent<TProps>(
  Component: ComponentType<TProps>,
): [ComponentType<TProps>, MarkerMockContext] {
  const ctx = creatMarkerMockContext();

  function Mock(props: TProps): ReactElement<object> {
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
