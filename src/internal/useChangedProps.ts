import { useRef } from "react";

import { pickChangedProps } from "./DataUtils";

export function useChangedProps<P extends object>(props: P): null | Partial<P> {
  const prevProps = useRef(props);
  const diff = pickChangedProps(prevProps.current, props);

  prevProps.current = props;

  return diff;
}
