export function createMVCArray<S, R>(
  maps: typeof google.maps,
  source: S[],
  mapper: (value: S) => R,
): google.maps.MVCArray<R> {
  const result = new maps.MVCArray<R>();

  source.forEach(x => {
    result.push(mapper(x));
  });

  return result;
}

export interface SizeLiteral {
  width: number;
  height: number;
}

export function createSize(maps: typeof google.maps, size: SizeLiteral) {
  return new maps.Size(size.width, size.height);
}

export interface PointLiteral {
  x: number;
  y: number;
}

export function createPoint(maps: typeof google.maps, point: PointLiteral) {
  return new maps.Point(point.x, point.y);
}

export function createLatLng(
  maps: typeof google.maps,
  position: google.maps.LatLngLiteral,
) {
  return new maps.LatLng(position.lat, position.lng);
}

export function createLatLngBounds(
  maps: typeof google.maps,
  bounds: google.maps.LatLngBoundsLiteral,
) {
  return new maps.LatLngBounds(
    createLatLng(maps, { lat: bounds.south, lng: bounds.west }),
    createLatLng(maps, { lat: bounds.north, lng: bounds.east }),
  );
}

export function pathToLatLngBounds(
  maps: typeof google.maps,
  path: google.maps.LatLngLiteral[],
) {
  return path.reduce((acc, x) => acc.extend(x), new maps.LatLngBounds());
}
