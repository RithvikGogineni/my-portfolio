// ===========================================================================
// A.3 — OTHER WORK
//
// The previous site had thirteen project pages; this one has six case
// studies. Seven projects fell off the end, and the audit was right that some
// of them are the ones a robotics reader would most want: a teaching artifact,
// a vision prototype, and the client work that pays for the parts.
//
// They come back as an index, not as seven more flagships. A row carries a
// number, a status, a sentence of what it is, a sentence of what I did, and
// a real image where one exists. Where no artifact exists, the row says so
// in as many words instead of borrowing a stock photograph.
//
// STATUS is a controlled vocabulary, and it is the point of the section:
//   Deployed        — running somewhere, for someone who is not me
//   Built           — finished and working; no deployment claimed
//   Prototype       — made, demonstrated to myself, not hardened
//   In development  — being built now; the feature list is a target
//   Published       — a document or artifact released to its audience
// Nothing is "Tested" unless there is a test to point at.
//
// SOURCES
//   R — public/Rithvik-Gogineni-Resume.pdf
//   S — the previous site's own project pages (captured in the audit evidence)
//   E — visible in an artifact in the repository; cited inline
// ===========================================================================

import guide from '../assets/images/ftc-starter-guide.webp';
import medrehab from '../assets/images/medrehab-website.webp';
import proper from '../assets/images/proper-constructions.webp';
import gorilla from '../assets/images/gorilla-gym.webp';

export const otherWork = [
  {
    id: 'other-ftc-starter-guide',
    n: '07',
    title: 'FTC Starter Guide',
    kind: 'Robotics · Technical writing',
    status: 'Published',
    when: '2024–25 season',
    // E — every fact in this entry is legible in the guide's own cover screen,
    // src/assets/images/ftc-starter-guide.webp, including the season it was
    // written in and the programme it was written under.
    summary:
      'A starter guide for new FIRST Tech Challenge teams, written by the Campion College robotics team during the 2024–25 “Into the Deep” season as part of our FIRST Steps outreach programme.',
    detail:
      'It runs from what FIRST and FTC actually are, through the engineering (components, the Control Hub, what a successful engineer is responsible for), into programming for complete beginners — Blocks and Java — and then into the two things nobody writes down: how teams get from an idea to a real robot, and how a Jamaican team finds funding and parts. Two further sections collect advice from team members and from FTC alumni.',
    ownership:
      'A team publication: it pools what our members, coaches and FIRST alumni had each learned. Engineering documentation was my area on 16075, and this is the outreach side of it — the guide exists so that a school starting from nothing does not have to repeat our first season.',
    media: {
      src: guide,
      alt: 'The starter guide open in its workspace, showing its navigation — Introduction, Engineering, Programming, The Voices of The People, FIRST Alumni, and Getting funding and parts — above an opening paragraph explaining who wrote it and when.',
      note: 'The guide is a working team workspace rather than a published document, so there is nothing to download here yet.',
    },
  },

  {
    id: 'other-object-tracking',
    n: '08',
    title: 'Autonomous Object Tracking',
    kind: 'Robotics · Computer vision',
    status: 'Prototype',
    when: 'Date not recorded',
    // S — the previous site's own description, which is all that exists.
    summary:
      'A vision prototype that followed colour and shape targets, built on OpenCV and TensorFlow for use on a robot.',
    detail:
      'Python, with OpenCV doing the detection and TensorFlow the classification, tracking a target by colour and by shape so a robot could keep it in frame.',
    ownership: 'Mine, as a prototype rather than a finished subsystem.',
    // The honest part. The previous site rendered a generic placeholder here,
    // so nothing was lost in the redesign — there was never an image.
    missing:
      'No clip, screenshot or repository was published for this on the previous site, and none has been supplied since. The description is the whole of the evidence, which is why it is a row here and not a case study.',
  },

  {
    id: 'other-jarvis',
    n: '09',
    title: 'JARVIS',
    kind: 'Software · AI',
    status: 'In development',
    when: 'Ongoing',
    // S — and deliberately left as the previous site had it: "Developing".
    summary:
      'A cross-platform personal AI assistant, in development.',
    detail:
      'The intended scope is natural-language understanding, speech recognition, face detection and reinforcement learning, in Python and Objective-C.',
    ownership: 'Mine.',
    missing:
      'That is a target, not a changelog. No build, demonstration or feature has been shown on this site, and the entry stays at “in development” until there is something specific to put next to it. It is listed because it is real work in progress, not because it is finished.',
  },

  {
    id: 'other-medrehab',
    n: '10',
    title: 'Med Rehab Professionals',
    kind: 'Client · Web & branding',
    status: 'Deployed',
    when: '2023–Present',
    summary:
      'The website and digital branding for a physiotherapy and rehabilitation clinic in Kingston.', // R + S
    detail:
      'Services, conditions, products, 3D foot scans, patient stories, FAQ and online booking, in a warm family-first identity rather than a clinical one.', // S
    ownership: 'Designed and built it.',
    // The audit's finding: these are two different deliverables for the same
    // client, and the site had started to blur them.
    note: 'The same clinic runs RehabOS. The website and the clinic operating system are separate pieces of work.',
    media: { src: medrehab, alt: 'The Med Rehab Professionals website.' },
    href: 'https://www.medrehabphysio.com/',
    to: '/work/rehabos#related',
    toLabel: 'RehabOS — the clinic',
  },

  {
    id: 'other-proper-constructions',
    n: '11',
    title: 'Proper Constructions Ltd.',
    kind: 'Client · Web',
    status: 'Built',
    when: '2023–Present',
    summary: 'A portfolio site for a construction firm.', // R + S
    detail: 'Projects and services, laid out so that the work is the content.', // S
    ownership: 'Designed and built it.',
    media: { src: proper, alt: 'The Proper Constructions Ltd. portfolio site.' },
    missing: 'No current live address has been confirmed for this one, so there is no link here yet.',
  },

  {
    id: 'other-gorilla-gym',
    n: '12',
    title: 'Gorilla Gym & Club1962',
    kind: 'Client · Web & brand',
    status: 'Built',
    when: '2023–Present',
    summary: 'Brand-aligned sites for a gym and an entertainment venue.', // R + S
    detail: 'Two clients, one approach: a minimal front for a business whose product is a room people walk into.', // S
    ownership: 'Designed and built both.',
    media: { src: gorilla, alt: 'The Gorilla Gym and Club1962 websites.' },
  },
];

// The previous site listed its own portfolio as project 06. A portfolio that
// features itself as a flagship is a hall of mirrors, but the redesign is
// worth one honest paragraph — and `/projects/6` needs somewhere to land.
export const colophonNote = {
  id: 'colophon',
  heading: 'About this edition',
  body: 'This is edition A.3 of the site, built in React and Vite. One motion library, no CMS, no analytics, no cookie banner — the only third-party request it makes is for the three typefaces. The previous edition, with its blog and gallery, is intact on the repository’s main branch.',
};
