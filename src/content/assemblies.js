// ===========================================================================
// A.2 — ASSEMBLY SCHEMAS
//
// Where real CAD exists, this view is built from the actual assembly — names,
// quantities and materials from the BOM, not from a template.     (sheet 02)
//
// No CAD file or bill of materials has been supplied for any project yet, so
// exactly one schema is defined below and it is marked `illustrative`. The
// viewer renders its label — ILLUSTRATIVE · AWAITING CAD — permanently and
// prominently, and the parts list says so in words. Nothing here is presented
// as a measured part of a real robot.
//
// TO REPLACE WITH REAL GEOMETRY:
//   1. Export the assembly's part transforms along its build axis (+Y up).
//   2. Add one entry per part: { id, name, qty, material, y, h, r, bore,
//      explode, holes }, in stack order, with `verified: true`.
//   3. Set `illustrative: false` and give the schema the project's slug.
//   The viewer, the parts list, the keyboard model and the text alternative
//   all read from this file — no component changes are required.
// ===========================================================================

export const assemblies = {
  'module-illustrative': {
    id: 'module-illustrative',
    illustrative: true,
    title: 'Generic rotary module',
    caption: 'Fig. 02 — Module, exploded',
    note: 'A generic rotary module, drawn to demonstrate the viewer. Where real CAD exists this view is built from the actual assembly — names, quantities and materials come from the bill of materials, not from a template.',
    axisLabel: 'Assembly axis',
    // Units are schematic. They are deliberately unlabelled: the exhibit shows
    // no dimension it cannot source.
    parts: [
      { id: 'p1', n: '01', name: 'Top plate', qty: 1, material: null,
        y: 26, h: 4, r: 40, bore: 9, explode: 2.2,
        holes: [{ pcd: 28, r: 3 }, { pcd: 28, r: 3, a: 120 }, { pcd: 28, r: 3, a: 240 }] },
      { id: 'p2', n: '02', name: 'Bearing housing', qty: 1, material: null,
        y: 14, h: 14, r: 30, bore: 14, explode: 1.5 },
      { id: 'p3', n: '03', name: 'Spacer sleeve', qty: 1, material: null,
        y: 0, h: 16, r: 24, bore: 12, explode: 0.6 },
      { id: 'p4', n: '04', name: 'Drive flange', qty: 1, material: null,
        y: -15, h: 6, r: 34, bore: 10, explode: -0.9,
        holes: [{ pcd: 24, r: 2.6 }, { pcd: 24, r: 2.6, a: 90 }, { pcd: 24, r: 2.6, a: 180 }, { pcd: 24, r: 2.6, a: 270 }] },
      { id: 'p5', n: '05', name: 'Base washer', qty: 1, material: null,
        y: -25, h: 3, r: 26, bore: 11, explode: -1.8 },
    ],
    views: [
      { id: 'iso', label: 'Isometric', yaw: 32, pitch: 26 },
      { id: 'front', label: 'Front', yaw: 0, pitch: 10 },
      { id: 'top', label: 'Top', yaw: 0, pitch: 58 },
    ],
  },
};

export const getAssembly = (id) => (id ? assemblies[id] : undefined);
