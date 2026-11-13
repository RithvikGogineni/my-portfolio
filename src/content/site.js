// ===========================================================================
// A.2 — SITE IDENTITY
//
// Every value here is taken from the résumé at public/Rithvik-Gogineni-Resume.pdf
// or from existing site copy. Nothing is inferred. If a fact is not in one of
// those two places it does not appear on the site.
//
// A.3 note on tense: the résumé dates the captaincy 2025–26 and the FIRST
// Global role 2025, both of which are now behind us, so the standing lines
// carry their seasons. "I captain" with no date was true when it was written
// and quietly stops being true; a dated line never does.
// ===========================================================================

export const site = {
  name: 'Rithvik Gogineni',
  nameLines: ['Rithvik', 'Gogineni'],
  initials: 'RG',
  discipline: 'Mechanical & Robotics Engineering, WPI',
  rule: 'Design · Build · Program',
  lede: 'I design, build, and program robots.',

  // Résumé — Education, and the three leadership lines under Robotics.
  standing: [
    'Captain, FTC Team 16075 — 2025–26.',
    'Lead Engineer, Team Jamaica — FIRST Global Challenge 2025.',
    'Founder, RehabOS.',
  ],

  availability: {
    open: true,
    line: 'Open to Summer 2027 internships.',
    headlineLines: ['Summer', '2027'],
    pitch:
      'Looking for a mechanical or robotics engineering internship. If you build things that move, I’d like to hear about them.',
  },

  // The résumé is the complete record, so it is reachable from the header,
  // the hero, every case study and the contact sheet rather than from one
  // link at the bottom of the home page.
  resume: {
    href: '/Rithvik-Gogineni-Resume.pdf',
    label: 'Résumé (PDF)',
    short: 'Résumé',
  },

  education: [
    {
      school: 'Worcester Polytechnic Institute',
      detail: 'B.S. Mechanical Engineering and Robotics Engineering',
      place: 'Worcester, MA',
      when: 'Expected May 2030',
    },
    {
      school: 'Campion College',
      detail: 'CAPE Sixth Form — Pure Mathematics, Physics, Economics · Second Honours Award',
      place: 'Kingston, Jamaica',
      when: '2019–2026',
    },
  ],

  contact: {
    email: 'goginenirithvik@gmail.com',
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/rithvik-gogineni-ba2a8330b' },
      { label: 'GitHub', href: 'https://github.com/RithvikGogineni' },
      { label: 'Résumé PDF', href: '/Rithvik-Gogineni-Resume.pdf' },
    ],
  },

  // Sheet S1 colophon — the strip that closes every page.
  colophon: {
    drawnBy: 'Rithvik Gogineni',
    institution: 'WPI · ME / RBE',
    revision: 'A.3',
  },
};

// Résumé — Experience & Leadership. Teaching numbers are the résumé's own.
export const practice = {
  statement: [
    { t: 'I work across mechanical engineering, robotics, AI, and software — because the interesting problems sit between them. I captained ' },
    { t: 'FTC Team 16075', voice: true },
    { t: ' through the 2025–26 season, led engineering for Team Jamaica at the FIRST Global Challenge, and started ' },
    { t: 'RehabOS', voice: true },
    { t: ' to put better software in Caribbean clinics.' },
  ],

  // The audit's finding 08: a recruiter could not reconstruct the background
  // from the redesigned page. These two lines are the shortest honest fix —
  // where I am from, where I am, and what I am reading.
  where: {
    from: 'Kingston, Jamaica',
    to: 'Worcester, Massachusetts',
    note: 'I grew up building robots in Kingston and now read Mechanical and Robotics Engineering at WPI. Most of the work below was done in one of those two places, and some of it in both.',
  },

  teaching: [
    { role: 'Robotics Teacher', org: 'Vaz Preparatory School', when: '2025–2026',
      note: 'Designed and taught hands-on robotics for 30+ students in Grades 1–6.' },
    { role: 'Robotics Instructor', org: 'Halls of Learning / Supreme Ventures Foundation', when: '2022–2025',
      note: 'Advanced from teaching assistant to instructor, teaching 80+ students including underserved youth and children in care.' },
    { role: 'Freelance Developer & Designer', org: 'Independent', when: '2023–Present',
      note: 'Websites and digital branding for Med Rehab Professionals, Proper Constructions Ltd., Gorilla Gym and Club1962.' },
  ],

  offices: [
    'President, Robotics Club (2025–26) · VP (2024–25) — technical workshops for 30 members',
    'President, Aeronautics Club (2023–26) · Secretary (2022–23)',
    'Vice-President, Motorsport Club (2025–26)',
  ],
};

// ---------------------------------------------------------------------------
// THE TOOLKIT
//
// Grouped by the kind of engineering it is used for rather than by language
// family, and every group names the projects it was actually used on. A tool
// with no project beside it is a word on a page; "Fusion 360 — FTC, FIRST
// Global, Humanoid" is a claim someone can go and check two clicks later.
//
// Source: the résumé's Technical Skills block, regrouped. Nothing is added.
// The percentage meters the previous site used are deliberately not back:
// "Python 90%" is a number with no units.
// ---------------------------------------------------------------------------
export const toolkit = [
  {
    n: '01',
    group: 'Mechanical design',
    tools: ['Fusion 360', 'Onshape', '3D printing', 'REV Robotics'],
    used: [
      { label: 'FTC 16075', slug: 'ftc-16075' },
      { label: 'FIRST Global', slug: 'first-global' },
      { label: 'Humanoid', slug: 'humanoid' },
    ],
  },
  {
    n: '02',
    group: 'Robotics & controls',
    tools: ['ROS', 'Raspberry Pi', 'Arduino'],
    used: [
      { label: 'Humanoid', slug: 'humanoid' },
      { label: 'FTC 16075', slug: 'ftc-16075' },
    ],
  },
  {
    n: '03',
    group: 'Programming',
    tools: ['Python', 'TypeScript / JavaScript', 'Java', 'SQL', 'C#', 'Dart'],
    used: [
      { label: 'RehabOS', slug: 'rehabos' },
      { label: 'Roamly', slug: 'roamly' },
      { label: 'FTC 16075', slug: 'ftc-16075' },
    ],
  },
  {
    n: '04',
    group: 'Product engineering',
    tools: ['React Native', 'Expo', 'Flutter', 'Supabase', 'PostgreSQL', 'Edge Functions', 'Vercel', 'Mapbox', 'Playwright', 'Git / GitHub'],
    used: [
      { label: 'RehabOS', slug: 'rehabos' },
      { label: 'Roamly', slug: 'roamly' },
      { label: 'NexusOS', slug: 'nexusos' },
    ],
  },
  {
    n: '05',
    group: 'AI',
    tools: ['OpenAI and Anthropic APIs', 'LLM agents', 'Speech-to-text pipelines', 'AI evaluation', 'Multi-armed bandits'],
    used: [
      { label: 'RehabOS', slug: 'rehabos' },
      { label: 'NexusOS', slug: 'nexusos' },
      { label: 'Humanoid', slug: 'humanoid' },
    ],
  },
];

// ---------------------------------------------------------------------------
// ACHIEVEMENTS
//
// Four entries, all of them from the résumé, each with its event, its year
// and its level stated separately — so nobody reads two awards from two
// different competitions as one result from one event, which is exactly what
// the undated list on the previous site invited.
//
// The previous site also listed an OUCC win (2021 & 2022), FIRST Lego League
// representation (2017), a chess title (2022) and an ABRSM grade (2023).
// None of those is on the résumé, and the OUCC entry expands the acronym in
// a way that does not match the competition of that name. They are held in
// ASSET-INVENTORY.md pending confirmation rather than republished here.
// ---------------------------------------------------------------------------
export const achievements = [
  {
    n: '01',
    award: 'Inspire Award',
    event: '2025 FIRST Championship',
    level: 'Jamaica',
    when: '2025',
    note: 'Won with Team 16075 at the 2025 FIRST Championship. The Inspire Award goes to the team judged strongest across the whole programme — robot, documentation and outreach together.',
    slug: 'ftc-16075',
  },
  {
    n: '02',
    award: 'Judges’ Choice (Ochoa) Award',
    event: '2025 FIRST Championship',
    level: 'Jamaica',
    when: '2025',
    note: 'Awarded to Team 16075 at the same championship, and a separate decision from the Inspire Award.',
    slug: 'ftc-16075',
  },
  {
    n: '03',
    award: '3rd — Katherine Johnson Award',
    event: 'FIRST Global Challenge, Panama',
    level: 'International',
    when: '2025',
    note: 'For engineering documentation, with Team Jamaica — and I led the engineering that the notebook describes.',
    slug: 'first-global',
  },
  {
    n: '04',
    award: '3rd-place finalist alliance',
    event: 'FIRST Global Challenge, Panama',
    level: 'International',
    when: '2025',
    note: 'The competition result for Team Jamaica at the Eco-Equilibrium season.',
    slug: 'first-global',
  },
];
