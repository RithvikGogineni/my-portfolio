// ===========================================================================
// A.4 — THE PERSON
//
// Sheet 02. The rest of the site is evidence; this is the one place that is
// allowed to be a voice. It still does not invent anything.
//
// SOURCING. Same rules as everywhere else — R résumé, S previous site copy,
// E an artifact in the repository. What is *not* sourced here is attitude:
// "the machines interest me as much as the racing" is a sentiment, not a
// claim, and it is the register the brief asked for. Where a sentence would
// have needed a fact I do not have — a habit, an opinion, a story — it was
// cut rather than filled in. Nothing below asserts an achievement, a date or
// a number that is not already established elsewhere on this site.
//
// The one item flagged for review is the piano: see `music` below.
// ===========================================================================

export const person = {
  // The headline and the interaction say the same thing, which is the point:
  // the portrait assembles itself out of particles while the words admit that
  // a person took some putting together too.
  headlineLines: ['Some assembly', 'required.'],
  kicker: '01 — The person',

  // Kingston → Worcester: R (résumé header and education block).
  lede:
    'I grew up in Kingston, Jamaica, and now study mechanical and robotics engineering in Worcester, Massachusetts — a move that has been an education in weather as much as in engineering.',

  body: [
    // That the interests exist at all: R (Motorsport Club, FTC, FIRST Global,
    // Aeronautics Club). The software turn: R (RehabOS, Roamly, NexusOS).
    //
    // The *order* is not a résumé fact and never was — a résumé lists
    // memberships, not the sequence someone acquired an interest in. The A.4
    // draft inferred "robots first" from the robotics entries being the most
    // prominent, which was a guess dressed as a sourced claim. The author
    // states it is cars first, then robots; that is the source, and it
    // outranks the inference. Do not reorder this back to match the
    // prominence of the résumé entries.
    'The short version is that I like things with moving parts. Cars got there first. Then robots, then anything that flies, and somewhere in the middle of all that the interest in mechanisms turned into writing the software that runs them too.',
    'Most of what is on this site started the same way: wanting to know whether something would actually work, and not being able to leave it alone until I found out.',
  ],

  // The portrait. A.4 replaces the 2023-era outdoor photograph with a current
  // one; the old file stays in the repository.
  portrait: {
    alt: 'Rithvik Gogineni, photographed straight on against a plain wall, wearing a dark quarter-zip over a black t-shirt.',
    caption: 'Fig. 01 — The subject',
  },

  // ------------------------------------------------------------------------
  // An index of things that keep my attention, not a grid of hobby cards.
  // Each one is a line of fact and a line of voice, in that order.
  // ------------------------------------------------------------------------
  interests: [
    {
      n: '01',
      name: 'Robotics',
      // R — two FTC seasons, FIRST Global, and the humanoid.
      fact: 'Two competition seasons with FTC 16075 and a national team at the FIRST Global Challenge.',
      voice: 'Also one humanoid in pieces on a desk, which is where this habit usually ends up.',
    },
    {
      n: '02',
      name: 'Motorsport',
      fact: 'Vice-president of the motorsport club.', // R
      voice: 'The machines interest me at least as much as the racing does.',
    },
    {
      n: '03',
      name: 'Aviation',
      // R — President, Aeronautics Club (2023–26); S — model flight design
      // projects and workshops on aerodynamics and flight principles.
      fact: 'Three years running the aeronautics club: model aircraft, and workshops on aerodynamics and flight principles.',
      voice: 'Anything that leaves the ground gets my attention, which is an expensive trait to have.',
    },
    {
      n: '04',
      name: '3D & Blender',
      // S — Blender listed under the previous site's design skills.
      // E — the FTC robot exists as a .blend before it exists in aluminium.
      fact: 'Blender, mostly for engineering visualisation.',
      voice: 'A competition robot exists as a model long before it exists as extrusion, and I enjoy that stage more than is strictly useful.',
    },
    {
      n: '05',
      name: 'Music',
      // S only — the previous site listed an ABRSM Grade 2 piano distinction
      // (2023). That award is in ASSET-INVENTORY.md awaiting confirmation, so
      // it is deliberately not claimed here; only the instrument is.
      fact: 'Piano.',
      voice: 'The one thing I do that does not involve a screen or a torque wrench.',
    },
    {
      n: '06',
      name: 'Building things',
      fact: 'A long tail of side projects — a clinic platform, a navigation app, an inventory system.', // R
      voice: 'Some of them became the work further down this page. The rest taught me something and stopped, which is also a result.',
    },
  ],
};
