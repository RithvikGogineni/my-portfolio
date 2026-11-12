// ===========================================================================
// A.2 — ORTHOGRAPHIC PROJECTION FOR THE ASSEMBLY EXHIBITS
//
// The exploded viewer is a real projection, not a stack of pictures. Parts are
// declared as parametric solids on a shared assembly axis (+Y, up); this module
// projects them through an orbit camera (yaw about Y, pitch from the horizon)
// into SVG user units.
//
// Because every revolved solid is axisymmetric, a yaw rotation leaves its
// silhouette unchanged and moves only its features — bolt circles, slots,
// keyways. That is exactly how a real CAD viewport behaves, and it is why the
// drawing stays dimensionally honest at every angle instead of being faked
// with a skew.
//
//   screenX = x·cosθ + z·sinθ
//   screenY = −y·cosφ + (−x·sinθ + z·cosθ)·sinφ
//   depth   =  y·sinφ + (−x·sinθ + z·cosθ)·cosφ
//
// A circle of radius r in the XZ plane therefore projects to an ellipse with
// semi-axes (r, r·sinφ) — exact, not approximated.
// ===========================================================================

const RAD = Math.PI / 180;

/** Project a point in assembly space to SVG space. */
export function project(p, cam) {
  const t = cam.yaw * RAD;
  const f = cam.pitch * RAD;
  const { x = 0, y = 0, z = 0 } = p;
  const xr = x * Math.cos(t) + z * Math.sin(t);
  const zr = -x * Math.sin(t) + z * Math.cos(t);
  return {
    x: xr * cam.scale,
    y: (-y * Math.cos(f) + zr * Math.sin(f)) * cam.scale,
    depth: y * Math.sin(f) + zr * Math.cos(f),
  };
}

/** Vertical semi-axis of a projected circle: r·sin(pitch), floored so an
 *  edge-on view still reads as a line rather than vanishing. */
export function ellipseRy(r, cam) {
  return Math.max(0.6, Math.abs(r * Math.sin(cam.pitch * RAD))) * cam.scale;
}

/** Centre of a circle that sits on the assembly axis at height y. */
export function axisCentre(y, cam) {
  return project({ x: 0, y, z: 0 }, cam);
}

/**
 * Build the drawable primitives for one part at a given explode factor.
 * Returns plain data; the component decides how to paint it. Keeping the
 * geometry out of the renderer is what lets the same schema drive the SVG
 * exhibit and the text alternative.
 */
export function buildPart(part, cam, explode) {
  // Parts separate along the axis they were assembled on, in stack order —
  // the physically plausible path, not a radial scatter.
  const lift = (part.explode ?? 0) * explode;
  const yTop = part.y + part.h / 2 + lift;
  const yBot = part.y - part.h / 2 + lift;

  const cTop = axisCentre(yTop, cam);
  const cBot = axisCentre(yBot, cam);
  const rx = part.r * cam.scale;
  const ry = ellipseRy(part.r, cam);
  const inner = part.bore ? part.bore * cam.scale : 0;
  const innerRy = part.bore ? ellipseRy(part.bore, cam) : 0;

  // Bolt circles and other features ride on the top face and rotate with yaw.
  const features = (part.holes ?? []).map((hole, i) => {
    const a = (hole.a ?? (i / (part.holes.length || 1)) * 360) * RAD;
    const p = project(
      { x: Math.cos(a) * hole.pcd, y: yTop, z: Math.sin(a) * hole.pcd },
      cam,
    );
    return { ...p, rx: hole.r * cam.scale, ry: ellipseRy(hole.r, cam), key: `${part.id}-h${i}` };
  });

  return {
    id: part.id,
    cTop,
    cBot,
    rx,
    ry,
    inner,
    innerRy,
    features,
    hasBody: part.h > 0.001,
    // Painter's order: parts further from the camera are drawn first.
    depth: (cTop.depth + cBot.depth) / 2,
    anchor: { x: cTop.x, y: (cTop.y + cBot.y) / 2 },
  };
}

/** Clamp a camera to the sensible limits the exhibit allows. */
export function clampCamera(cam) {
  return {
    ...cam,
    yaw: ((cam.yaw % 360) + 360) % 360,
    // 90° is a true plan view — the hero's default, and the one the sheet
    // draws. Below ~6° a revolved solid is edge-on and stops reading as a
    // part, so that is the floor.
    pitch: Math.min(90, Math.max(6, cam.pitch)),
    scale: Math.min(2.2, Math.max(0.7, cam.scale)),
  };
}
