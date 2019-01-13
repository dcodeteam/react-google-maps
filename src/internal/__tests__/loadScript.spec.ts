import { loadScript } from "../loadScript";

afterEach(() => {
  document.body.innerHTML = "";
});

it("adds script tag", () => {
  loadScript("https://path.to/file.js");

  expect(document.body).toMatchInlineSnapshot(`
<body>
  <script
    defer=""
    src="https://path.to/file.js"
  />
</body>
`);
});
