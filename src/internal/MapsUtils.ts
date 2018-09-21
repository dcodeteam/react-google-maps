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
