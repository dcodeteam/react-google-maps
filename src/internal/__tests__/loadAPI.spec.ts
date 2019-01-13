import { loadAPI } from "../loadAPI";

afterEach(() => {
  document.body.innerHTML = "";
});

it("adds script tag", () => {
  const fn = jest.fn();

  loadAPI("secret-key", fn);

  expect(fn).toBeCalledTimes(0);
  expect(document.body).toMatchInlineSnapshot(`
<body>
  <script
    defer=""
    src="https://maps.googleapis.com/maps/api/js?libraries=places,drawing,geometry&key=secret-key&callback=__google_maps_loader_callback__"
  />
</body>
`);
});
