const CALLBACK = "__google_maps_loader_callback__";
const CALLBACK_STACK = "__google_maps_loader_callback_stack__";
const MAPS_URL = "https://maps.googleapis.com/maps/api/js";

function addScript(src: string): void {
  const script = document.createElement("script");

  script.src = src;
  script.async = true;
  script.defer = true;

  document.body.appendChild(script);
}

function getStack(): Set<() => void> {
  // eslint-disable-next-line
  const global = window as any;

  if (!global[CALLBACK_STACK]) {
    global[CALLBACK_STACK] = new Set();
  }

  return global[CALLBACK_STACK];
}

function ensureCallback(): void {
  // eslint-disable-next-line
  const global = window as any;

  if (!global[CALLBACK]) {
    global[CALLBACK] = () => {
      const stack = getStack();

      stack.forEach(fn => fn());

      stack.clear();
    };
  }
}

export function loadAPI(key: string, onSuccess: () => void): () => void {
  const stack = getStack();

  ensureCallback();

  stack.add(onSuccess);

  addScript(
    `${MAPS_URL}?libraries=places,drawing,geometry&key=${key}&callback=${CALLBACK}`,
  );

  return () => {
    stack.delete(onSuccess);
  };
}
