import { GenericEvent } from "../internal/GenericEvent";

export class GoogleMapEvent {
  public static readonly onClick = GenericEvent.onClick;

  public static readonly onDoubleClick = GenericEvent.onDoubleClick;

  public static readonly onRightClick = GenericEvent.onRightClick;

  public static readonly onMouseOut = GenericEvent.onMouseOut;

  public static readonly onMouseOver = GenericEvent.onMouseOver;

  public static readonly onMouseMove = GenericEvent.onMouseMove;

  public static readonly onDrag = GenericEvent.onDrag;

  public static readonly onDragStart = GenericEvent.onDragStart;

  public static readonly onDragEnd = GenericEvent.onDragEnd;

  public static readonly onIdle = "idle";

  public static readonly onTilesLoaded = "tilesloaded";

  public static readonly onTiltChanged = "tilt_changed";

  public static readonly onZoomChanged = "zoom_changed";

  public static readonly onBoundsChanged = "bounds_changed";

  public static readonly onCenterChanged = "center_changed";

  public static readonly onHeadingChanged = "heading_changed";

  public static readonly onMapTypeIdChanged = "maptypeid_changed";

  public static readonly onProjectionChanged = "projection_changed";
}
