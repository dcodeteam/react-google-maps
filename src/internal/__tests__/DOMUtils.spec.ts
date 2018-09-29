import { loadScript } from "../DOMUtils";

describe("DOMUtils", () => {
  describe("loadScript", () => {
    beforeEach(() => {
      document.body.innerHTML = `<script/>`;
    });

    it("should add script tag", () => {
      const spy = jest.spyOn(document, "createElement");

      loadScript("SCRIPT_ID", "https://path.to/file.js");

      expect(spy).toBeCalled();

      const script = spy.mock.results[0].value as HTMLScriptElement;

      expect(document.body.innerHTML).toEqual(
        expect.stringContaining(script.outerHTML),
      );

      spy.mockRestore();
    });

    it("should add script handlers tag", () => {
      const onResolve = jest.fn();
      const onReject = jest.fn();
      const spy = jest.spyOn(document, "createElement");

      loadScript("SCRIPT_ID", "https://path.to/file.js", onResolve, onReject);

      const script = spy.mock.results[0].value as HTMLScriptElement;

      expect(script.onload).toBeDefined();
      expect(onResolve).toBeCalledTimes(0);

      expect(script.onerror).toBeDefined();
      expect(onReject).toBeCalledTimes(0);

      expect(() => script.onload!({} as Event)).not.toThrow();
      expect(onResolve).toBeCalledTimes(1);

      expect(() => script.onerror!({} as Event)).not.toThrow();
      expect(onReject).toBeCalledTimes(1);

      spy.mockRestore();
    });

    it("should not load script with same id twice", () => {
      const spy = jest.spyOn(document, "createElement");

      loadScript("SCRIPT_ID", "https://path.to/file.js");

      expect(spy).toBeCalled();

      spy.mockReset();

      loadScript("SCRIPT_ID", "https://path.to/file.js");

      expect(spy).not.toBeCalled();

      spy.mockRestore();
    });
  });
});
