import { useRef } from "react";

import { pickChangedProps } from "./DataUtils";

export function useChangedProps<TProps extends object>(
  props: TProps,
): null | Partial<TProps> {
  const prevProps = useRef(props);
  const diff = pickChangedProps(prevProps.current, props);

  prevProps.current = props;

  return diff;
}
