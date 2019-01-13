import React from "react";
import { cleanup, flushEffects, render } from "react-testing-library";

import {
  UseGoogleMapsResult,
  useGoogleMapsLoader,
} from "../useGoogleMapsLoader";

const Container = ({
  checkAPI,
}: {
  checkAPI: (api: UseGoogleMapsResult) => void;
}) => {
  const api = useGoogleMapsLoader("secret-key");

  checkAPI(api);

  return null;
};

afterEach(() => {
  cleanup();

  document.body.innerHTML = "";
});

it("starts load of script", () => {
  const { rerender } = render(
    <Container
      checkAPI={api => {
        expect(api).toMatchInlineSnapshot(`
Object {
  "error": false,
  "maps": undefined,
}
`);
      }}
    />,
  );

  expect(document.body).toMatchInlineSnapshot(`
<body>
  <div />
</body>
`);

  flushEffects();

  expect(document.body).toMatchInlineSnapshot(`
<body>
  <div />
  <script
    defer=""
    src="https://maps.googleapis.com/maps/api/js?libraries=places,drawing,geometry&key=secret-key&callback=__google_maps_loader_callback__"
  />
</body>
`);

  rerender(
    <Container
      checkAPI={api => {
        expect(api).toMatchInlineSnapshot(`
Object {
  "error": false,
  "maps": undefined,
}
`);
      }}
    />,
  );

  expect.assertions(4);
});
