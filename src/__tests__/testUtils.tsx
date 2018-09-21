const { Map: OriginalMap, Marker: OriginalMarker } = google.maps;

export function mockMap() {
  return jest
    .spyOn(google.maps, "Map")
    .mockImplementation((node, options) => new OriginalMap(node, options));
}

export function mockMarker() {
  return jest
    .spyOn(google.maps, "Marker")
    .mockImplementation(options => new OriginalMarker(options));
}
