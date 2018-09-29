import * as React from "react";

import { GoogleMap, GoogleMapProps, GoogleMapsLoader } from "..";

export function DocsMap(props: GoogleMapProps) {
  return (
    <GoogleMapsLoader
      apiKey="AIzaSyA-jxUCmizaZ0lFsWk8HS5-MzEkXH7atPk"
      render={maps => (
        <GoogleMap {...props} maps={maps} style={{ height: "320px" }} />
      )}
    />
  );
}
