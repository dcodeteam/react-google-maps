import * as React from "react";

import { GoogleMapProps, GoogleMapsLoader, Map } from "..";

export function DocsMap(props: GoogleMapProps) {
  return (
    <GoogleMapsLoader
      apiKey="AIzaSyA-jxUCmizaZ0lFsWk8HS5-MzEkXH7atPk"
      render={maps => (
        <Map {...props} maps={maps} style={{ height: "320px" }} />
      )}
    />
  );
}
