export function loadScript(src: string): void {
  const script = document.createElement("script");

  script.src = src;
  script.async = true;
  script.defer = true;

  document.body.appendChild(script);
}
