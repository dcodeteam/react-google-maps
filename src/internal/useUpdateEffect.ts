import { EffectCallback, InputIdentityList, useEffect, useRef } from "react";

export function useUpdateEffect(fn: EffectCallback, inputs: InputIdentityList) {
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;

      return;
    }

    return fn();
  }, inputs);
}
