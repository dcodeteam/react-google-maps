import { GenericEvent } from "../internal/GenericEvent";

export class MarkerEvent {
  public static readonly onClick = GenericEvent.onClick;

  public static readonly onDoubleClick = GenericEvent.onDoubleClick;

  public static readonly onRightClick = GenericEvent.onRightClick;

  public static readonly onMouseOut = GenericEvent.onMouseOut;

  public static readonly onMouseOver = GenericEvent.onMouseOver;

  public static readonly onMouseDown = GenericEvent.onMouseDown;

  public static readonly onMouseUp = GenericEvent.onMouseUp;

  public static readonly onDrag = GenericEvent.onDrag;

  public static readonly onDragStart = GenericEvent.onDragStart;

  public static readonly onDragEnd = GenericEvent.onDragEnd;

  public static readonly onPositionChanged = "position_changed";
}
