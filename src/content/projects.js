// ===========================================================================
// A.2 — INDEX OF WORK
//
// SOURCING RULE (from sheet S2 of the approved concept):
//   "Nothing on the site is invented. Anything marked [supply] or
//    Illustrative is a placeholder and stays visibly so until you send the
//    real material."
//
// Every fact below is traceable to one of:
//   R  — public/Rithvik-Gogineni-Resume.pdf
//   S  — existing site copy (previous src/data/projects.js)
//   D  — prose written by the author in the approved A.2 concept PDF
// No award, date, number or specification appears here that is not in one of
// those three. Where a figure is missing, `media.illustrative` is true and the
// well renders a labelled engineering placeholder rather than a stand-in
// photograph. Text modules with no verified content are omitted entirely
// rather than rendered as empty scaffolding.
//
// A missing asset is tracked in ./inventory.js, not faked here.
// ===========================================================================

import ftcRobot from '../assets/images/ftc-robot.webp';
import fgcRobot from '../assets/images/fgc-robot.webp';
import rehabos from '../assets/images/rehabos.webp';
import nexusos from '../assets/images/nexusos.webp';
import roamly from '../assets/images/roamly.webp';
import medrehab from '../assets/images/medrehab-website.webp';

export const projects = [
  // -------------------------------------------------------------------------
  {
    slug: 'humanoid',
    number: '01',
    title: 'The Humanoid',
    titleLines: ['The', 'Humanoid'],
    kind: 'Robotics',
    featured: true,
    role: 'Independent build',          // R
    when: '2025',                       // R
    stack: ['Raspberry Pi', 'ROS', 'CAD', '3D Printing'], // R
    // D — the author's own line from the approved concept.
    lede: 'A humanoid robot modeled in CAD, printed in parts, driven by a Raspberry Pi running ROS, with an LLM-based AI onboard.',

    media: {
      illustrative: true,
      assetId: 'A-01',
      figure: 'Fig. 02 — Inspect · Structure',
      need: 'Studio photograph or clean CAD render, 4:5',
      drawing: 'humanoid',
      alt: 'Front-elevation engineering drawing of a humanoid robot, shown with a centre line and joint markers. A labelled placeholder standing in until a photograph of the real build is available.',
    },

    facts: [
      { label: 'Process', value: '3D-modeled · 3D-printed', verified: true },   // R
      { label: 'Compute', value: 'Raspberry Pi · ROS', verified: true },        // R
      { label: 'Intelligence', value: 'Onboard LLM-based AI', verified: true }, // R
      { label: 'My role', value: 'Designed, built and programmed, independently', verified: true }, // R
    ],

    // The featured inspection: four subsystems, a dashed focus box travelling
    // between them. Copy for `structure` is the author's own (D); the rest
    // are the résumé's own verbs, not invented specifications.
    systems: [
      { id: 'structure', n: '01', name: 'Structure',
        note: 'Designed in CAD and printed in parts, so every joint, bracket and shell is a decision rather than an off-the-shelf compromise.', // D
        focus: { x: 50, y: 46, w: 44, h: 72 } },
      { id: 'actuation', n: '02', name: 'Actuation',
        note: 'The printed limbs and joints were assembled from scratch alongside the electronics, rather than dropped onto a donor chassis.', // R
        focus: { x: 50, y: 52, w: 84, h: 40 } },
      { id: 'compute', n: '03', name: 'Compute',
        note: 'A Raspberry Pi runs the control software under ROS, integrating the structure, the electronics and the onboard compute into one system.', // R
        focus: { x: 50, y: 20, w: 34, h: 26 } },
      { id: 'intelligence', n: '04', name: 'Intelligence',
        note: 'An onboard LLM system interprets conversational commands and responds to them, so the robot is spoken to rather than driven.', // R
        focus: { x: 50, y: 16, w: 26, h: 20 } },
    ],

    ownership: {
      heading: 'What I owned',
      body: 'Everything. The CAD, the print runs, the assembly, the electronics integration, the ROS control software and the onboard LLM layer were all mine — this was an independent build, not a team project.', // R
    },

    assembly: 'module-illustrative',
  },

  // -------------------------------------------------------------------------
  {
    slug: 'ftc-16075',
    number: '02',
    title: 'FTC Team 16075',
    titleLines: ['FTC Team', '16075'],
    kind: 'Robotics',
    role: 'Captain 2025–26 · Vice-Captain 2024–25', // R
    when: '2024–2026',                              // R
    stack: ['FTC', 'Mechanical integration', 'Autonomous', 'Documentation'],
    lede: 'Two seasons of competition robots — intake, transfer, launching and autonomous — and the documentation and debugging that carried them through the season.', // R

    media: { src: ftcRobot, verified: true,
      figure: 'Fig. 01 — The robot',
      alt: 'The FTC Team 16075 competition robot.' },

    facts: [
      { label: 'My role', value: 'Captain (2025–26), Vice-Captain (2024–25)', verified: true }, // R
      { label: 'Seasons', value: '2024–25 · 2025–26', verified: true },                         // R
      { label: 'Competition', value: 'FIRST Tech Challenge', verified: true },                  // R
      // CONFIRMED 2026-11-12: the résumé wording is correct. The approved
      // concept PDF says "National 2nd Place Inspire Award"; that was a
      // drafting guess and is deliberately not used here. Do not reconcile
      // this line to the PDF.
      { label: 'Result', value: 'Jamaica Inspire Award · Judges’ Choice (Ochoa)', verified: true }, // R
    ],

    systems: [
      { id: 'intake', n: '01', name: 'Intake', note: 'One of the four competition subsystems I led through mechanical integration and iterative development.' },   // R
      { id: 'transfer', n: '02', name: 'Transfer', note: 'Integrated with the intake and launcher as a single mechanical path rather than three separate builds.' }, // R
      { id: 'launching', n: '03', name: 'Launching', note: 'Developed iteratively across the season alongside the intake and transfer it depends on.' },           // R
      { id: 'autonomous', n: '04', name: 'Autonomous', note: 'The fourth subsystem in the same development loop, and the one competition debugging touched most.' }, // R
    ],

    result: {
      lines: ['Inspire', 'Award'],
      caption: 'Jamaica Inspire Award and the Judges’ Choice (Ochoa) Award at the 2025 FIRST Championship.', // R
    },

    ownership: {
      heading: 'What I owned',
      body: 'Mechanical integration and the iterative development of the competition robots across both seasons, plus competition debugging and the engineering documentation. As captain I carried the team through the 2025–26 season.', // R
    },

    assembly: 'module-illustrative',
  },

  // -------------------------------------------------------------------------
  {
    slug: 'first-global',
    number: '03',
    title: 'FIRST Global Challenge',
    titleLines: ['FIRST', 'Global'],
    kind: 'Robotics',
    role: 'Lead Engineer, Team Jamaica', // R
    when: '2025 · Panama',               // R
    stack: ['CAD', 'Mechanical design', 'Projectile calculation'],
    lede: 'Jamaica’s national robot for the Eco-Equilibrium season — a flywheel shooter sized by hand, and the testing that made it repeatable.', // R + S

    media: { src: fgcRobot, verified: true,
      figure: 'Fig. 01 — The robot',
      alt: 'Team Jamaica’s FIRST Global Challenge robot for the Eco-Equilibrium season.' },

    facts: [
      { label: 'My role', value: 'Lead Engineer', verified: true },                 // R
      { label: 'Season', value: 'Eco-Equilibrium · 2025', verified: true },         // R
      { label: 'Host', value: 'Panama', verified: true },                           // R
      { label: 'Result', value: '3rd-place finalist alliance', verified: true },    // R
      { label: 'Award', value: '3rd — Katherine Johnson Award', verified: true },   // R
    ],

    systems: [
      { id: 'shooter', n: '01', name: 'Flywheel shooter',
        note: 'Launches biodiversity units into a 6 ft goal. The wheel and release geometry were sized with custom projectile calculations rather than tuned by trial.' }, // S
      { id: 'integration', n: '02', name: 'Mechanical integration',
        note: 'I led the robot’s design and brought the subsystems together into one machine for the national team.' }, // R
      { id: 'testing', n: '03', name: 'Testing & iteration',
        note: 'Testing and competition iteration ran through the season — the shooter that went to Panama is not the one that left the bench first.' }, // R
    ],

    result: {
      lines: ['3rd-place', 'alliance'],
      caption: 'Finalist alliance, and 3rd for the Katherine Johnson Award for engineering documentation.', // R
    },

    ownership: {
      heading: 'What I owned',
      body: 'Robot design, mechanical integration, testing and competition iteration for Jamaica’s national team — and the engineering documentation that placed 3rd for the Katherine Johnson Award.', // R
    },

    assembly: 'module-illustrative',
  },

  // -------------------------------------------------------------------------
  {
    slug: 'rehabos',
    number: '04',
    title: 'RehabOS',
    titleLines: ['RehabOS'],
    kind: 'Software · AI',
    role: 'Founder & Lead Engineer', // R
    when: '2025–Present',            // R
    stack: ['AI / LLM', 'Speech pipelines', 'Playwright'],
    lede: 'An AI-native clinic operating system, running in a real physiotherapy practice in Kingston — not a prototype, a deployment.', // R

    media: { src: rehabos, verified: true,
      figure: 'Fig. 01 — The platform',
      alt: 'The RehabOS clinic operating system interface.' },

    facts: [
      { label: 'My role', value: 'Founder & Lead Engineer', verified: true }, // R
      { label: 'Deployed at', value: 'Med Rehab Professionals, Kingston', verified: true }, // R
      { label: 'Staff', value: '8+', verified: true },      // R
      { label: 'Patients', value: '100+', verified: true }, // R
      { label: 'Sessions', value: '200+', verified: true }, // R
      { label: 'Formerly', value: 'PhysioOS', verified: true }, // R
    ],

    architecture: {
      heading: 'How it works',
      items: [
        { n: '01', name: 'Intake',
          note: 'AI-assisted intake that detects conflicts in a patient’s clinical history rather than just recording it.' }, // R
        { n: '02', name: 'Floor state',
          note: 'Room and device tracking, and exercise verification, so the clinic’s physical state is part of the record.' }, // R
        { n: '03', name: 'Follow-up',
          note: 'Automated WhatsApp and SMS follow-ups, because that is where patients in Kingston actually reply.' }, // R
        { n: '04', name: 'Speech',
          note: 'A three-stage speech pipeline built for Jamaican English and Patois — off-the-shelf transcription does not handle either.' }, // R
      ],
    },

    reliability: {
      heading: 'Reliability',
      body: 'Playwright QA runs across 67 platform pages. A clinic operating system that drops a session is worse than no clinic operating system.', // R
      stat: { value: '67', unit: 'pages under test' },
    },

    related: {
      heading: 'The clinic',
      body: 'I also designed and built Med Rehab Professionals’ own website and digital branding. The clinic it belongs to is the one running RehabOS.', // R + S
      media: { src: medrehab, verified: true, alt: 'The Med Rehab Professionals website.' },
      href: 'https://www.medrehabphysio.com/',
    },

    ownership: {
      heading: 'What I owned',
      body: 'Founded it and led the engineering — the intake model, the speech pipeline, the tracking, the follow-up automation and the test suite.', // R
    },
  },

  // -------------------------------------------------------------------------
  {
    slug: 'nexusos',
    number: '05',
    title: 'NexusOS',
    titleLines: ['NexusOS'],
    kind: 'Software · AI',
    role: 'Founder & Product Architect', // R
    when: '2025–2026',                   // R
    stack: ['Next.js', 'TypeScript', 'AI agents'], // R
    lede: 'An AI-native inventory platform for e-commerce SMBs, built around specialist agents that are supervised rather than trusted.', // R

    media: { src: nexusos, verified: true,
      figure: 'Fig. 01 — The platform',
      alt: 'The NexusOS inventory platform interface.' },

    facts: [
      { label: 'My role', value: 'Founder & Product Architect', verified: true }, // R
      { label: 'Also known as', value: 'Nexus Inventory', verified: true },       // R
      { label: 'Stack', value: 'Next.js · TypeScript · AI', verified: true },     // R
    ],

    architecture: {
      heading: 'How it works',
      items: [
        { n: '01', name: 'Specialist agents',
          note: 'Separate agents for restocking, demand forecasting and supplier workflows, rather than one general agent asked to do all three.' }, // R
        { n: '02', name: 'Supervisor & critic',
          note: 'An oversight layer reviews what the specialists propose before any of it reaches the operator.' }, // R
        { n: '03', name: 'Confidence scoring',
          note: 'Every proposal carries a confidence score, so the operator can see which ones the system is unsure about.' }, // R
        { n: '04', name: 'Human approval',
          note: 'Guardrails keep a person in the loop on the decisions that move money or stock.' }, // R
      ],
    },

    ownership: {
      heading: 'What I owned',
      body: 'The product architecture — the agent split, the supervisor/critic oversight model, the confidence scoring and the human-approval guardrails.', // R
    },
  },

  // -------------------------------------------------------------------------
  {
    slug: 'roamly',
    number: '06',
    title: 'Roamly',
    titleLines: ['Roamly'],
    kind: 'Software',
    role: 'Founder & Developer', // R
    when: '2025–Present',        // R
    stack: ['React Native', 'TypeScript', 'Supabase', 'Mapbox'], // R
    lede: 'A navigation app that takes a mood and a time budget instead of a destination, and gives you a route back.', // R

    media: { src: roamly, verified: true,
      figure: 'Fig. 01 — The app',
      alt: 'The Roamly navigation app interface.' },

    facts: [
      { label: 'My role', value: 'Founder & Developer', verified: true }, // R
      { label: 'Modes', value: 'Drive · Walk · Run · Bike', verified: true }, // R
      { label: 'Stack', value: 'React Native · TypeScript · Supabase · Mapbox', verified: true }, // R
    ],

    architecture: {
      heading: 'How it works',
      items: [
        { n: '01', name: 'Route generation',
          note: 'Routes are generated from mood and time budget across drive, walk, run and bike, with turn-by-turn voice guidance.' }, // R
        { n: '02', name: 'Edge routing',
          note: 'Routing moved to Deno / Supabase Edge Functions to isolate the API keys and make caching work across users rather than per-device.' }, // R
        { n: '03', name: 'Road safety',
          note: 'Crowdsourced road-safety ratings feed back into which roads a route is willing to use.' }, // R
        { n: '04', name: 'Trip planning',
          note: 'An Anthropic-powered planner extends the same idea from one outing to a multi-day trip.' }, // R
      ],
    },

    reliability: {
      heading: 'The migration',
      body: 'Routing originally ran on-device. Moving it to Edge Functions isolated the API keys and turned a per-device cache into a shared one — the same request from two users is now answered once.', // R
    },

    ownership: {
      heading: 'What I owned',
      body: 'All of it — the app, the routing migration, the safety-rating system and the trip planner.', // R
    },
  },
];

export const bySlug = (slug) => projects.find((p) => p.slug === slug);
export const featured = projects.find((p) => p.featured) ?? projects[0];
// The index excludes whichever project is featured above it on the home page.
export const indexed = projects.filter((p) => !p.featured);
