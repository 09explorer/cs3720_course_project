import { useRef, useState } from "react";
import { Image, PanResponder, StyleSheet, Text, View } from "react-native";
import { colors, fontSize, radius } from "../constants/theme";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

// The field is square. Point x/y are inches measured from the BOTTOM-LEFT
// corner (x right, y up). Change these to match your coordinate system.
const FIELD_SIZE_INCHES = 144;

const POINT_RADIUS = 14; // drawn circle radius (px)
const HIT_SIZE = 48; // touch target (px), larger than the circle
const DOT_SIZE = 4; // dotted-line dot diameter (px)
const DOT_SPACING = 12; // distance between dot centers along the path (px)

// ---------------------------------------------------------------------------
// Path equations
//
// A path function receives the control points in CANVAS PIXELS ([{ x, y }])
// and returns a polyline of vertices ([{ x, y }]) that describes the curve.
// The dotted line is drawn evenly along whatever polyline is returned.
// To change the path, point PATH_FN at a different function.
// ---------------------------------------------------------------------------

// Straight segments from each point to the next.
const linearPath = (pts) => pts;

// One Bezier curve using every point as a control point (de Casteljau).
// Note: the curve passes through the first and last points only.
const bezierPath = (pts, steps = 40) => {
  if (pts.length < 3) return pts;
  const out = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    let level = pts;
    while (level.length > 1) {
      level = level.slice(1).map((p, j) => ({
        x: level[j].x + (p.x - level[j].x) * t,
        y: level[j].y + (p.y - level[j].y) * t,
      }));
    }
    out.push(level[0]);
  }
  return out;
};

const PATH_FN = linearPath; // <-- swap for bezierPath, or your own function

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const round2 = (n) => String(Math.round(n * 100) / 100);

// Place dots at equal arc-length intervals along a polyline.
function dotsAlong(poly, spacing) {
  const dots = [];
  if (poly.length < 2) return dots;
  let carry = 0; // distance already travelled since the last dot
  for (let i = 0; i < poly.length - 1; i++) {
    const a = poly[i];
    const b = poly[i + 1];
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    if (len === 0) continue;
    let d = spacing - carry;
    while (d <= len) {
      const t = d / len;
      dots.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
      d += spacing;
    }
    carry = len - (d - spacing);
  }
  return dots;
}

// ---------------------------------------------------------------------------
// Draggable point
// ---------------------------------------------------------------------------

function DraggablePoint({
  id,
  label,
  px,
  py,
  selected,
  size,
  onSelect,
  onDrag,
  onRelease,
}) {
  // Keep the latest props reachable from the (create-once) PanResponder.
  const latest = useRef({});
  latest.current = { id, px, py, size, onSelect, onDrag, onRelease };
  const start = useRef({ x: 0, y: 0 });

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      // Don't let the parent ScrollView steal the gesture mid-drag.
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        const l = latest.current;
        start.current = { x: l.px, y: l.py };
        l.onSelect?.(l.id); // pressing selects, even without a move
      },
      onPanResponderMove: (_, g) => {
        const l = latest.current;
        l.onDrag(
          l.id,
          clamp(start.current.x + g.dx, 0, l.size),
          clamp(start.current.y + g.dy, 0, l.size),
        );
      },
      onPanResponderRelease: () => latest.current.onRelease(),
      onPanResponderTerminate: () => latest.current.onRelease(),
    }),
  ).current;

  return (
    <View
      {...responder.panHandlers}
      style={[
        styles.hit,
        { left: px - HIT_SIZE / 2, top: py - HIT_SIZE / 2 },
        selected && styles.hitSelected,
      ]}
    >
      <View style={[styles.circle, selected && styles.circleSelected]}>
        <Text style={styles.circleText} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// FieldCanvas
//
// Props:
//  - points:      [{ id, label, x, y, h }]  (label/x/y/h are strings)
//  - selectedId:  id of the selected point
//  - background:  image URL drawn behind everything (backgroundURL also works)
//  - onSelect:    (id) => void               called when a point is pressed
//  - onMovePoint: (id, { x, y }) => void     called while dragging; x/y are
//                                            inch strings, same format as points
// ---------------------------------------------------------------------------
export default function FieldCanvas({
  points = [],
  selectedId,
  background,
  backgroundURL,
  onSelect,
  onMovePoint,
}) {
  const [size, setSize] = useState(0);
  const [drag, setDrag] = useState(null); // { id, x, y } in px while dragging
  const imageUri = background ?? backgroundURL;

  const toPx = (inches, flip) => {
    const v = (parseFloat(inches) / FIELD_SIZE_INCHES) * size;
    return flip ? size - v : v;
  };

  // Points with usable numeric coordinates (fields may be empty mid-typing).
  const placed = [];
  if (size > 0) {
    for (const p of points) {
      const x = toPx(p.x, false);
      const y = toPx(p.y, true);
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
      const live = drag && drag.id === p.id ? drag : null;
      placed.push({
        id: p.id,
        label: p.label,
        px: clamp(live ? live.x : x, 0, size),
        py: clamp(live ? live.y : y, 0, size),
      });
    }
  }

  const dots = dotsAlong(
    PATH_FN(placed.map(({ px, py }) => ({ x: px, y: py }))),
    DOT_SPACING,
  );

  const handleDrag = (id, x, y) => {
    setDrag({ id, x, y });
    onMovePoint?.(id, {
      x: round2((x / size) * FIELD_SIZE_INCHES),
      y: round2(((size - y) / size) * FIELD_SIZE_INCHES),
    });
  };

  // Selected point is rendered last so it sits on top.
  const ordered = [...placed].sort(
    (a, b) => (a.id === selectedId) - (b.id === selectedId),
  );

  return (
    <View
      style={styles.wrap}
      onLayout={(e) => setSize(e.nativeEvent.layout.width)}
    >
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={styles.background}
          resizeMode="cover"
        />
      ) : null}

      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {dots.map((d, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { left: d.x - DOT_SIZE / 2, top: d.y - DOT_SIZE / 2 },
            ]}
          />
        ))}
      </View>

      {ordered.map((p) => (
        <DraggablePoint
          key={p.id}
          id={p.id}
          label={p.label}
          px={p.px}
          py={p.py}
          size={size}
          selected={p.id === selectedId}
          onSelect={onSelect}
          onDrag={handleDrag}
          onRelease={() => setDrag(null)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    aspectRatio: 1, // the field is square
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  dot: {
    position: "absolute",
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: colors.text,
  },
  hit: {
    position: "absolute",
    width: HIT_SIZE,
    height: HIT_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  hitSelected: { zIndex: 1 },
  circle: {
    width: POINT_RADIUS * 2,
    height: POINT_RADIUS * 2,
    borderRadius: POINT_RADIUS,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  circleSelected: { backgroundColor: colors.primary, borderColor: colors.text },
  circleText: {
    color: colors.text,
    fontSize: fontSize.small,
    fontWeight: "800",
  },
});
