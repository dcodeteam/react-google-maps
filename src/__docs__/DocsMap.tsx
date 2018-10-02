import * as React from "react";

import { Omit } from "../internal/DataUtils";
import { GoogleMapProps, GoogleMapsLoader, Map } from "..";

type DocsMapProps = Omit<GoogleMapProps, "maps">;

export function DocsMap(props: DocsMapProps) {
  return (
    <GoogleMapsLoader
      apiKey="AIzaSyA-jxUCmizaZ0lFsWk8HS5-MzEkXH7atPk"
      render={maps => (
        <Map {...props} maps={maps} style={{ height: "320px" }} />
      )}
    />
  );
}
