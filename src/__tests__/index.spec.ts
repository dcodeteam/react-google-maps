import * as index from "../index";

it("exposes public api", () => {
  expect(index).toMatchInlineSnapshot(
    {
      GoogleMapContext: expect.any(Object),
      GoogleMapsAPIContext: expect.any(Object),
      GoogleMapMarkerContext: expect.any(Object),
    },
    `
Object {
  "CustomControl": [Function],
  "DataPolygon": [Function],
  "DrawingControl": [Function],
  "FitBounds": [Function],
  "FullscreenControl": [Function],
  "GoogleMapContext": Any<Object>,
  "GoogleMapMarkerContext": Any<Object>,
  "GoogleMapsAPIContext": Any<Object>,
  "InfoWindow": [Function],
  "Map": [Function],
  "MapTypeControl": [Function],
  "Marker": [Function],
  "MarkerIcon": [Function],
  "MarkerSymbol": [Function],
  "PanBy": [Function],
  "PanTo": [Function],
  "PanToBounds": [Function],
  "Polyline": [Function],
  "RotateControl": [Function],
  "ScaleControl": [Function],
  "StreetViewControl": [Function],
  "ZoomControl": [Function],
  "useGoogleMap": [Function],
  "useGoogleMapMarker": [Function],
  "useGoogleMapsAPI": [Function],
  "useGoogleMapsLoader": [Function],
}
`,
  );
});
