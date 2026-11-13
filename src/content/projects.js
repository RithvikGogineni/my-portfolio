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
//   N  — a dated engineering document; the document is named at the claim
// No award, date, number or specification appears here that is not in one of
// those four. Where a figure is missing, `media.illustrative` is true and the
// well renders a labelled engineering placeholder rather than a stand-in
// photograph. Text modules with no verified content are omitted entirely
// rather than rendered as empty scaffolding.
//
// ---------------------------------------------------------------------------
// A.3 — WHAT CHANGED, AND WHY
//
// The audit found several sentences that were stronger than their sources.
// Each is corrected below and marked `// A.3`. The pattern was the same every
// time: a résumé line stating what was *done* had acquired a clause stating
// what it was *better than*, and the comparison was never in the source.
//
//   "…rather than tuned by trial"          → the calculation, without the foil
//   "…does not handle either"              → the pipeline, without the verdict
//   "…the one debugging touched most"      → the subsystem, without the rank
//   "…answered once"                       → cross-user caching, which is what
//                                            the résumé actually says
//
// A.3 also adds two modules, `iterations` and `decisions`, to the two
// robotics flagships. Both are drawn from dated team engineering documents —
// named in `source` on each module — and both exist because the audit was
// right that the case studies described systems without ever showing a
// decision being made. A rejected prototype with its reason is worth more
// than three paragraphs about the accepted one.
//
// ATTRIBUTION. Those documents describe team robots. The résumé is specific
// about which part was mine, and `ownership` on each project says so without
// taking the team's credit with it.
//
// `status` uses the same controlled vocabulary as content/other.js.
// ===========================================================================

import ftcRobot from '../assets/images/ftc-robot.webp';
import fgcRobot from '../assets/images/fgc-robot.webp';
import rehabos from '../assets/images/rehabos.webp';
import medrehab from '../assets/images/medrehab-website.webp';
import roamly from '../assets/images/roamly.webp';

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
    status: 'Built',                    // R — built and programmed; no demonstration is claimed
    stack: ['Raspberry Pi', 'ROS', 'CAD', '3D Printing'], // R
    // D — the author's own line from the approved concept.
    lede: 'A humanoid robot modeled in CAD, printed in parts, driven by a Raspberry Pi running ROS, with an LLM-based AI onboard.',

    media: {
      illustrative: true,
      assetId: 'A-01',
      // The system name is appended by the inspector, which owns which system
      // is selected. Keeping it out of the content stops the two drifting.
      figure: 'Fig. 02 — Inspect',
      need: 'Studio photograph or clean CAD render, 4:5',
      drawing: 'humanoid',
      alt: 'Front-elevation engineering drawing of a humanoid robot, shown with a centre line and joint markers. A labelled placeholder standing in until a photograph of the real build is available.',
    },

    facts: [
      { label: 'Process', value: '3D-modeled · 3D-printed', verified: true },   // R
      { label: 'Compute', value: 'Raspberry Pi · ROS', verified: true },        // R
      { label: 'Intelligence', value: 'Onboard LLM-based AI', verified: true }, // R
      { label: 'My role', value: 'Designed, built and programmed, independently', verified: true }, // R
      // A.3 — the audit asked for status on the humanoid, and this is the
      // honest one: it was built; nothing on this site shows it moving.
      { label: 'Status', value: 'Built 2025 · no demonstration published', verified: true },
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

    // A.3 — what the page cannot show, said on the page rather than only in
    // the inventory. The audit's finding 05: the flagship is illustrative,
    // and the honest move while that is true is to say so where it shows.
    limits: {
      heading: 'What this page cannot show you',
      body: 'There is no photograph of this robot on this site, and the drawing above is a placeholder, clearly marked as one. Degrees of freedom, actuator selection and the control topology are not listed because I have not published measurements for them. When there is a build photograph and a clip of it responding to a command, they go here and this note comes out.',
    },

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
    // CONFIRMED 2026-11-13: co-captain, not captain. The résumé says
    // "Captain (2025–26)"; the team's own DECODE-season engineering
    // portfolio shows a two-person co-captain model, and that is the
    // correct one. The served résumé PDF still reads "Captain" — the
    // site and the document it links to therefore disagree on this line
    // until the PDF is reissued.
    role: 'Co-Captain 2025–26 · Vice-Captain 2024–25', // N
    when: '2024–2026',                              // R
    status: 'Competed',
    stack: ['FTC', 'Mechanical integration', 'Autonomous', 'Documentation'],
    // A.3 — the audit asked for the two seasons to be identifiable. Both game
    // names are evidenced: "Into the Deep" is named in the starter guide the
    // team published that season; DECODE is on the cover of the 2025–26
    // engineering portfolio.
    lede: 'Two seasons with Jamaica’s Team 16075 — Into the Deep in 2024–25, DECODE in 2025–26. The intake, the transfer and the launcher were each rebuilt between the first prototype and the field.',

    media: { src: ftcRobot,
      // A.3 — this is a CAD render carried over from the previous site. It is
      // a render of a robot; whether it is *the* competition robot of either
      // season is not something this site can establish, so it no longer says
      // so. The audit was explicit that a filename is not provenance.
      verified: false,
      figure: 'Fig. 01 — Robot render',
      provenance: 'Carried over from the previous site. A render, not a competition photograph; its season is unconfirmed.',
      alt: 'A CAD render of an FTC robot: an aluminium extrusion chassis on four mecanum wheels, carrying a vertical tower, a motor-driven roller and a control hub.' },

    facts: [
      { label: 'My role', value: 'Co-Captain (2025–26), Vice-Captain (2024–25)', verified: true }, // N
      { label: 'Seasons', value: 'Into the Deep 2024–25 · DECODE 2025–26', verified: true },    // N
      { label: 'Robot', value: 'Sir Launch-a-lot (2025–26)', verified: true },                  // N
      { label: 'Competition', value: 'FIRST Tech Challenge', verified: true },                  // R
      // CONFIRMED 2026-11-12: the résumé wording is correct. The approved
      // concept PDF says "National 2nd Place Inspire Award"; that was a
      // drafting guess and is deliberately not used here. Do not reconcile
      // this line to the PDF.
      { label: 'Result', value: 'Jamaica Inspire Award · Judges’ Choice (Ochoa)', verified: true }, // R
    ],

    // N — subsystem descriptions from the team's 2025–26 engineering
    // portfolio for the DECODE season. These are the robot as it was built,
    // not as it was first drawn; `iterations` below is how it got there.
    systems: [
      { id: 'intake', n: '01', name: 'Intake',
        note: 'Dual-stage and fully open, so an ARTIFACT can be collected without the driver lining the robot up first. Stage one pulls it off the field; stage two pushes it on, with a chain down the centre acting as a conveyor and vectored wheels on either side centring it as it goes.' },
      { id: 'transfer', n: '02', name: 'Transfer',
        note: 'A third stage with a high-torque motor of its own, stationary until it is asked for. Giving it its own motor is what made the feed repeatable rather than dependent on the robot holding still.' },
      { id: 'launching', n: '03', name: 'Launcher',
        note: 'A turret-mounted hooded flywheel. The turret aims across the field independently of where the drivetrain is pointing, and the hood sets the launch angle, so the robot can shoot without first turning to face the goal.' },
      // A.3 — was: "…and the one competition debugging touched most."
      // The rank was not in any source.
      { id: 'autonomous', n: '04', name: 'Autonomous',
        note: 'A webcam reads the MOTIF; odometry and AprilTag readings are fused under a Kalman filter so the shooter can align and fire from any point in the routine rather than only from a start position.' },
    ],

    iterations: {
      heading: 'How it got there',
      source: 'From the team’s engineering portfolio for the 2025–26 DECODE season.',
      items: [
        {
          sub: 'Intake', v: 'V1', name: 'The Gobbler', verdict: 'Rejected',
          what: 'A single roller pulling ARTIFACTS straight in. Simple and light.',
          why: 'It had limited pulling force and lost grip while the robot was moving — a single stage cannot keep control of a game element at speed.',
          learned: 'A second stage improves consistency and the distance an ARTIFACT travels far more than a bigger motor does. Compression and guiding matter as much as power.',
        },
        {
          sub: 'Intake', v: 'V2', name: 'The Binary Bicycle Contraption', verdict: 'Accepted',
          what: 'Two stages: collect from the field, then push into the transfer. A chain down the middle works as a conveyor, and vectored wheels on each side centre the ARTIFACT on the way through.',
          why: 'Higher power draw, which is the trade. It bought reliability under match conditions.',
          learned: 'High-speed testing showed the conveyor and the vectored wheels together reduced bounce-outs and stopped misfeeds into the transfer.',
        },
        {
          sub: 'Transfer', v: 'V1', name: 'The Kicker', verdict: 'Rejected',
          what: 'A pivoting arm that kicked ARTIFACTS into the shooter, using a centred pocket and gravity to hold them in place.',
          why: 'Gravity centring did align the ARTIFACT well, but the mechanism was timing-sensitive: an impact shifted the ARTIFACT and the next feed missed.',
          learned: 'A passive transfer is only as steady as the robot. Active control, on its own motor, is what makes the cycle repeatable.',
        },
        {
          sub: 'Transfer', v: 'V2', name: 'The Spinner', verdict: 'Accepted',
          what: 'A third-stage roller with its own high-torque motor, actively pulling ARTIFACTS into the shooter.',
          why: 'An independent motor decouples the feed from everything else the robot is doing.',
          learned: 'Independent motors allow faster and more repeatable cycles than a shared drive.',
        },
        {
          sub: 'Launcher', v: 'V1', name: 'The Buckshot', verdict: 'Accepted',
          what: 'Turret plus hooded high-speed flywheel, built hybrid — extrusion for the structure, 3D prints for the shaped parts.',
          why: 'The turret gives horizontal aim without rotating the robot; the curved hood controls exit angle and trajectory. Both reduce what the driver has to do.',
          learned: 'Hood angle and flywheel RPM tuning are what make the arc repeatable, and the frame needs reinforcement to hold accuracy under repeated firing.',
        },
      ],
    },

    decisions: {
      heading: 'Decisions',
      source: 'The same portfolio records the tradeoff each of these came out of.',
      items: [
        {
          name: 'Dead-wheel odometry, not optical tracking',
          body: 'Optical tracking depends on the field surface and on precise mounting, and it drifts when either is imperfect. Physical dead-wheel odometry with sensor fusion was chosen instead and its accuracy checked against tape-measure positions.',
          cost: 'More hardware on the chassis, and more to keep aligned.',
        },
        {
          name: 'A passive webcam, not a smart camera',
          body: 'The smart camera draws about 1.5 A with its own LEDs, and that sag was measurably degrading shooter exit velocity. A passive webcam drawing about 0.2 A was chosen instead.',
          cost: 'Worse detection in poor light. Voltage stability for the shooter was ranked above detection quality, deliberately.',
        },
        {
          name: 'Automatic launch-zone holding',
          body: 'Leaving the launch zone during tele-op is a penalty, so a PID loop watches the robot’s distance from the zone boundary and applies corrective drive velocity on its own. A robot that gets bumped puts itself back.',
          cost: 'The driver gives up some authority over the robot while shooting. That was the intent.',
        },
        {
          name: 'Current-watching on the intake',
          body: 'The intake jams on debris. Motor current is monitored continuously; above 12 A for more than 200 ms the intake reverses briefly and retries, and after two failed attempts it disables itself so the autonomous routine can carry on without it.',
          cost: 'A jammed ARTIFACT is given up rather than fought for — the match continues, the gearbox survives.',
        },
      ],
    },

    result: {
      lines: ['Inspire', 'Award'],
      caption: 'Jamaica Inspire Award and the Judges’ Choice (Ochoa) Award at the 2025 FIRST Championship.', // R
    },

    ownership: {
      heading: 'What I owned',
      // A.3 — the audit asked for team credit and personal credit to be
      // separable. The decisions above are the team's; this is the line the
      // résumé actually supports.
      body: 'Mechanical integration and the iterative development of the competition robots across both seasons — intake, transfer, launching and autonomous — plus competition debugging and the engineering documentation. I co-captained the team through the 2025–26 season under a deliberate two-person model — engineering was my half of it, programming my counterpart’s. 16075 is a student-led team of about a dozen across engineering, programming and technical writing, and the design record above is the team’s work, not one person’s.', // R + N
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
    status: 'Competed',
    stack: ['CAD', 'Mechanical design', 'Projectile calculation'],
    // A.3 — was "a flywheel shooter sized by hand, and the testing that made
    // it repeatable". The drivetrain is the part with a documented iteration
    // behind it, so it leads.
    lede: 'Jamaica’s national robot for the Eco-Equilibrium season. Three drivetrains in, it still could not strafe — and the fix was a bar that let us set how hard one wheel pressed on the floor.',

    media: { src: fgcRobot,
      // A.3 — same treatment as the FTC render, and the same reason.
      verified: false,
      figure: 'Fig. 01 — Robot render',
      provenance: 'Carried over from the previous site. A render, not a competition photograph.',
      alt: 'A CAD render of the FIRST Global robot: a chain-driven chassis carrying a chain-fed elevator and a flywheel assembly, with two spherical game elements beside it.' },

    facts: [
      { label: 'My role', value: 'Lead Engineer', verified: true },                 // R
      { label: 'Season', value: 'Eco-Equilibrium · 2025', verified: true },         // R
      { label: 'Host', value: 'Panama', verified: true },                           // R
      { label: 'Robot', value: 'Probox Curry', verified: true },                    // N
      { label: 'Result', value: '3rd-place finalist alliance', verified: true },    // R
      { label: 'Award', value: '3rd — Katherine Johnson Award', verified: true },   // R
    ],

    systems: [
      { id: 'drivetrain', n: '01', name: 'H-drive',
        // N — the problem statement is the notebook's own.
        note: 'The three ecosystems sit in different parts of the field and the robot had to cross between them in under five seconds, on a base stable enough to carry every other mechanism. An H-drive: two parallel sets of drive wheels for forward and back, one centre wheel for strafing.' },
      { id: 'intake', n: '02', name: 'Intake & storage',
        note: 'Biodiversity units are scattered and have to be collected actively, stored more than three at a time, and handed to the shooter without jamming on the way. That last requirement is the one that killed the first two designs.' }, // N
      { id: 'shooter', n: '03', name: 'Flywheel shooter',
        // A.3 — was "…rather than tuned by trial". The calculation is in the
        // previous site's copy; the claim that it replaced empirical tuning
        // was not, and the audit flagged it.
        note: 'Launches biodiversity units into a 6 ft goal, with the wheel and release geometry sized using custom projectile calculations.' }, // S
      { id: 'testing', n: '04', name: 'Testing & iteration',
        note: 'Every mechanism was built as a standalone module so it could be developed, tested and swapped without touching the rest of the robot. Weekly build sessions, each opening with the objectives for the day.' }, // N
    ],

    iterations: {
      heading: 'How it got there',
      source: 'From Team Jamaica’s engineering notebook for the 2025 season — the document that placed 3rd for the Katherine Johnson Award.',
      items: [
        {
          sub: 'Drivetrain', v: 'V1', name: 'Chain-driven holonomic', verdict: 'Rejected',
          what: 'The first chassis that could strafe at all, which was the point of holonomic movement in the first place.',
          why: 'Plastic mounting brackets flexed under load, so the chassis lost rigidity. Uneven mass distribution and a high centre of gravity made strafing inconsistent and the robot unstable in turns — worst exactly when it was handling barriers.',
          learned: 'Strafing is a chassis-stiffness problem before it is a wheel problem.',
        },
        {
          sub: 'Drivetrain', v: 'V2', name: 'Chain-driven holonomic with tuning bar', verdict: 'Rejected',
          what: 'A tuning bar on the centre strafe axle, letting us set the downward force on that wheel by hand. Metal brackets replaced the plastic ones.',
          why: 'Traction improved and slip during hard lateral movement dropped. But the wheels had no guards, and the construction was not modular, so maintenance meant taking apart things that were working.',
          learned: 'The adjustment was the right idea. The packaging around it was not.',
        },
        {
          sub: 'Drivetrain', v: 'V3', name: 'Fortified holonomic with tuning bar', verdict: 'Accepted',
          what: 'The V2 geometry with protective wheel guards and parallel mounting bars, so the centre strafe motor can be adjusted finely and in place.',
          why: 'Modular, stiff, and still multi-directional. Weight distribution remained the thing to watch.',
          learned: 'The original symptom was simply that the robot would not move sideways, because the centre strafe wheel was not making proper contact with the floor. Three versions later, the answer was a way to adjust that contact rather than a better wheel.',
        },
        {
          sub: 'Intake', v: 'V1', name: 'Dual-stage roller', verdict: 'Rejected',
          what: 'Two roller stages on one motor through a chain drive, with compliant wheels to grip and guide the biodiversity units.',
          why: 'Misaligned rollers made pickup slow and inconsistent; the transfer path to storage jammed and dropped units; and the whole thing was not modular enough to repair between matches.',
          learned: 'Serviceability under time pressure is a design requirement, not an afterthought.',
        },
        {
          sub: 'Intake', v: 'V2', name: 'Tri-stage roller with traction wheels', verdict: 'Rejected',
          what: 'A three-stage pipeline with a funnel to mitigate jams, packaged compactly.',
          why: 'The pipeline was reliable, but it overloaded when units came in quickly, and the mechanical footprint it needed was too large.',
          learned: 'Jam mitigation and throughput pull in opposite directions; the funnel that stops jams is the thing that limits the rate.',
        },
      ],
    },

    result: {
      lines: ['3rd-place', 'alliance'],
      caption: 'Finalist alliance, and 3rd for the Katherine Johnson Award for engineering documentation.', // R
    },

    ownership: {
      heading: 'What I owned',
      body: 'Robot design, mechanical integration, testing and competition iteration for Jamaica’s national team — and the engineering documentation that placed 3rd for the Katherine Johnson Award. Team Jamaica 2025 was twenty-seven students and four coaches, with eight travelling to Panama; the iterations above were the team’s, and leading the engineering through them was my job.', // R + N
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
    status: 'Deployed',              // R
    stack: ['AI / LLM', 'Speech pipelines', 'Playwright'],
    lede: 'An AI-native clinic operating system, running in a real physiotherapy practice in Kingston — not a prototype, a deployment.', // R

    media: { src: rehabos, verified: true,
      figure: 'Fig. 01 — The platform',
      // A.3 — the audit: the chosen screen shows an incomplete setup and no
      // activity, which is weak evidence for the usage figures beside it. The
      // honest fix is to say what the screen is rather than to imply it is a
      // busy production day.
      provenance: 'A clinic dashboard early in setup, with the onboarding checklist still open and the counters at zero. It is not the production clinic’s data, and it is not evidence of the usage figures above it — those come from the résumé.',
      alt: 'The RehabOS clinic dashboard: a left rail of clinic, clinical, operations and engagement sections; an onboarding checklist reading two of seven complete; and counters for outstanding invoices, appointments today, active patients and sessions this month, all at zero.' },

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
        // A.3 — was: "…off-the-shelf transcription does not handle either."
        // The pipeline is the résumé's; the verdict on everyone else's
        // transcription was not, and I have no benchmark to support it.
        { n: '04', name: 'Speech',
          note: 'A three-stage speech pipeline built for Jamaican English and Patois.' }, // R
      ],
    },

    reliability: {
      heading: 'Reliability',
      // A.3 — the audit: a page count alone does not establish reliability.
      // The sentence now says what the number is and what it is not.
      body: 'Playwright runs across 67 platform pages. That is coverage, not a reliability result — it says every page was exercised, not that every path through them is correct. It is in here because a clinic system that drops a session is worse than no clinic system, and page-level coverage is the floor I hold it to while I build towards something better.', // R
      stat: { value: '67', unit: 'pages under test' },
    },

    related: {
      heading: 'The clinic',
      body: 'I also designed and built Med Rehab Professionals’ own website and digital branding. The clinic it belongs to is the one running RehabOS — two separate pieces of work for the same client, and worth keeping apart: one is a public website, the other is the software the practice runs on.', // R + S
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
    // A.3 — the résumé's verbs here are "designed" and "architected", not
    // "deployed" or "shipped". The status says exactly that.
    status: 'Designed',
    stack: ['Next.js', 'TypeScript', 'AI agents'], // R
    lede: 'An AI-native inventory platform for e-commerce SMBs, built around specialist agents that are supervised rather than trusted.', // R

    media: {
      // A.3 — WITHDRAWN. The image that was here is the product's marketing
      // landing page, and it states "Eighteen specialized AI agents" and
      // "Trusted by 247+ businesses worldwide" in its own pixels. Neither
      // number is in the résumé or in any record I have, and an unsupported
      // claim is no less published for being set in type inside a PNG.
      // The file is still in the repository; it is not on the site.
      illustrative: true,
      assetId: 'A-05',
      figure: 'Fig. 01 — Awaiting a product screen',
      need: 'Screenshot of the proposal → review → approval workflow',
      alt: 'No product screenshot is published for NexusOS yet.',
      withheld: 'The marketing page that used to sit here carries customer and agent counts I cannot support, so it has been taken down rather than relabelled. A screen of the actual approval workflow replaces it.',
    },

    facts: [
      { label: 'My role', value: 'Founder & Product Architect', verified: true }, // R
      { label: 'Also known as', value: 'Nexus Inventory', verified: true },       // R
      { label: 'Stack', value: 'Next.js · TypeScript · AI', verified: true },     // R
      // A.3 — the boundary the audit asked for, stated as a fact rather than
      // left for the reader to infer.
      { label: 'Status', value: 'Designed and architected · no deployment claimed', verified: true },
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

    limits: {
      heading: 'What is and is not claimed here',
      body: 'This is an architecture: the agent split, the oversight model, the scoring and the approval guardrails were designed and built towards. There are no customer numbers on this page, no agent count and no deployment, because I have no record to put behind any of them. The product’s own marketing page states figures I have not been able to verify, and it is deliberately not shown here.',
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
    status: 'Built',             // R — "built", "migrated", "shipped"; no public release claimed
    stack: ['React Native', 'TypeScript', 'Supabase', 'Mapbox'], // R
    lede: 'A navigation app that takes a mood and a time budget instead of a destination, and gives you a route back.', // R

    media: { src: roamly,
      // A.3 — the audit: this is the logo, and it was captioned as an
      // interface. It is a real asset of a real project, so it stays — under
      // what it actually is.
      verified: true,
      figure: 'Fig. 01 — Identity',
      provenance: 'The app’s identity, not its interface. No screenshot of route selection or navigation has been published yet.',
      need: 'Screenshot of route selection or turn-by-turn navigation',
      alt: 'The Roamly logotype: a single green line looping into the shape of an R, with a filled dot where the line crosses itself, above the word Roamly and the line “Take the Scenic Route.”' },

    facts: [
      { label: 'My role', value: 'Founder & Developer', verified: true }, // R
      { label: 'Modes', value: 'Drive · Walk · Run · Bike', verified: true }, // R
      { label: 'Stack', value: 'React Native · TypeScript · Supabase · Mapbox', verified: true }, // R
      { label: 'Status', value: 'Built · no public release claimed', verified: true },
    ],

    architecture: {
      heading: 'How it works',
      items: [
        { n: '01', name: 'Route generation',
          note: 'Routes are generated from mood and time budget across drive, walk, run and bike, with turn-by-turn voice guidance.' }, // R
        { n: '02', name: 'Edge routing',
          note: 'Routing moved to Deno / Supabase Edge Functions to isolate the API keys and to make caching work across users rather than per device.' }, // R
        { n: '03', name: 'Road safety',
          note: 'Crowdsourced road-safety ratings feed back into which roads a route is willing to use.' }, // R
        { n: '04', name: 'Trip planning',
          note: 'An Anthropic-powered planner extends the same idea from one outing to a multi-day trip.' }, // R
      ],
    },

    reliability: {
      heading: 'The migration',
      // A.3 — was "…the same request from two users is now answered once",
      // which is a specific behavioural claim about the cache. The résumé
      // says the migration was done "to isolate API keys and enable
      // cross-user caching". That is what this says now.
      body: 'Routing originally ran on-device, which put the map and routing keys on the handset and gave every device its own cache. Moving it to Edge Functions isolated the keys behind a server boundary and made caching work across users rather than per device.', // R
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
