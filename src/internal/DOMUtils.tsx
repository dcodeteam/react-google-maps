export function loadScript(
  id: string,
  src: string,
  onResolve?: () => void,
  onReject?: () => void,
): void {
  if (document.getElementById(id)) {
    return;
  }

  const ref = document.getElementsByTagName("script")[0];
  const script = document.createElement("script");

  script.id = id;
  script.src = src;
  script.async = true;
  script.defer = true;

  if (onResolve) {
    script.onload = () => onResolve();
  }

  if (onReject) {
    script.onerror = () => onReject();
  }

  ref.parentNode!.insertBefore(script, ref);
}
