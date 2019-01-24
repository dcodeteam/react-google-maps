export function createMVCArray<TSource, TResult>(
  maps: typeof google.maps,
  source: Array<TSource>,
  mapper: (value: TSource) => TResult,
): google.maps.MVCArray<TResult> {
  const result = new maps.MVCArray<TResult>();

  source.forEach(x => {
    result.push(mapper(x));
  });

  return result;
}

export interface SizeLiteral {
  width: number;
  height: number;
}

export function createSize(
  maps: typeof google.maps,
  size: SizeLiteral,
): google.maps.Size {
  return new maps.Size(size.width, size.height);
}

export interface PointLiteral {
  x: number;
  y: number;
}

export function createPoint(
  maps: typeof google.maps,
  point: PointLiteral,
): google.maps.Point {
  return new maps.Point(point.x, point.y);
}

export function createLatLng(
  maps: typeof google.maps,
  position: google.maps.LatLngLiteral,
): google.maps.LatLng {
  return new maps.LatLng(position.lat, position.lng);
}

export function createLatLngBounds(
  maps: typeof google.maps,
  bounds: google.maps.LatLngBoundsLiteral,
): google.maps.LatLngBounds {
  return new maps.LatLngBounds(
    { lat: bounds.south, lng: bounds.west },
    { lat: bounds.north, lng: bounds.east },
  );
}

export function pathToLatLngBounds(
  maps: typeof google.maps,
  path: Array<google.maps.LatLngLiteral>,
): google.maps.LatLngBounds {
  return path.reduce((acc, x) => acc.extend(x), new maps.LatLngBounds());
}
