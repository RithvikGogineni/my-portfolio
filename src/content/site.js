// ===========================================================================
// A.2 — SITE IDENTITY
//
// Every value here is taken from the résumé at public/Rithvik-Gogineni-Resume.pdf
// or from existing site copy. Nothing is inferred. If a fact is not in one of
// those two places it does not appear on the site.
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
    'Captain, FTC Team 16075.',
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
    revision: 'A.2',
  },
};

// Résumé — Technical Skills, grouped the way the approved sheet groups them.
export const disciplines = [
  'Competition Robotics',
  'CAD',
  'Mechanical Systems',
  'AI',
  'Full-Stack Software',
  'Product Development',
  '3D Visualization',
];

// Résumé — Experience & Leadership. Teaching numbers are the résumé's own.
export const practice = {
  statement: [
    { t: 'I work across mechanical engineering, robotics, AI, and software — because the interesting problems sit between them. I captain ' },
    { t: 'FTC Team 16075', voice: true },
    { t: ', led engineering for Team Jamaica at the FIRST Global Challenge, and started ' },
    { t: 'RehabOS', voice: true },
    { t: ' to put better software in Caribbean clinics.' },
  ],
  teaching: [
    { role: 'Robotics Teacher', org: 'Vaz Preparatory School', when: '2025–2026',
      note: 'Designed and taught hands-on robotics for 30+ students in Grades 1–6.' },
    { role: 'Robotics Instructor', org: 'Halls of Learning / Supreme Ventures Foundation', when: '2022–2025',
      note: 'Advanced from teaching assistant to instructor, teaching 80+ students including underserved youth and children in care.' },
    { role: 'Freelance Developer & Designer', org: 'Independent', when: '2023–Present',
      note: 'Websites and digital branding for Med Rehab Professionals, Proper Constructions Ltd., Gorilla Gym and Club1962.' },
  ],
  offices: [
    'President, Robotics Club (2025–26) · VP (2024–25)',
    'President, Aeronautics Club (2023–26) · Secretary (2022–23)',
    'Vice-President, Motorsport Club (2025–26)',
  ],
};
