import { StreamCareerData } from '../types';

export const careerData: StreamCareerData[] = [
  {
    stream: 'Science',
    title: 'Science & Technology',
    description: 'A pathway focusing on observation, logical inquiry, empirical research, technology, and engineering. Highly suitable for students strong in logical analysis, mathematics, biology, and computer science.',
    suitableFor: 'Logical thinkers, problem solvers, tech enthusiasts, and students with a curiosity about nature, medicine, and technology.',
    degrees: [
      {
        id: 'btech',
        name: 'B.Tech / B.E (Bachelor of Technology / Engineering)',
        description: 'Professional engineering degree covering fields like Computer Science, Electronics, Mechanical, Civil, Biotech, and Chemical Engineering.',
        duration: '4 Years (After Class 12)',
        govExams: [
          'GATE (for PSU recruitment like IOCL, ONGC)',
          'Kerala PSC Assistant Engineer (PWD, Irrigation, LSGD)',
          'ISRO & BARC Scientist/Engineer Recruitment',
          'Railway Recruitment Board (RRB) Junior Engineer',
          'UPSC Engineering Services Exam (ESE)'
        ],
        privateRoles: [
          'Software Developer / Systems Engineer',
          'Data Analyst / AI Developer',
          'Structural / Civil Construction Engineer',
          'Automotive Design Engineer',
          'Biomedical Specialist'
        ],
        higherStudies: [
          'M.Tech / M.E at IITs/NITs (via GATE)',
          'MS (Master of Science) in Europe, US, or Germany',
          'MBA / PGDM in IIMs (via CAT for techno-managerial roles)',
          'PhD in Research Institutions'
        ]
      },
      {
        id: 'mbbs',
        name: 'MBBS / BDS / Allied Health Sciences',
        description: 'Medical and dental streams, alongside allied options like B.Sc Nursing, Physiotherapy (BPT), and Pharmacy (B.Pharm).',
        duration: '4.5 to 5.5 Years + Internship',
        govExams: [
          'NEET PG (for MD/MS specialization)',
          'Kerala PSC Medical Officer / Dental Surgeon',
          'UPSC Combined Medical Services (CMS)',
          'Military Nursing Services / Army Dental Corps'
        ],
        privateRoles: [
          'General Practitioner / Specialist Doctor',
          'Clinical Research Associate',
          'Hospital Administrator',
          'Pharmaceutical Product Manager',
          'Physiotherapist / Sports Therapist'
        ],
        higherStudies: [
          'MD / MS / MDS (Specializations)',
          'DNB (Diplomate of National Board)',
          'Master of Public Health (MPH)',
          'M.Pharm / Pharm.D'
        ]
      },
      {
        id: 'bsc_pure',
        name: 'B.Sc / BS (Pure & Applied Sciences)',
        description: 'Bachelor of Science in Physics, Chemistry, Mathematics, Statistics, Biotechnology, or Agriculture.',
        duration: '3 to 4 Years (As per NEP)',
        govExams: [
          'CSIR NET / UGC NET (for JRF and Lectureship)',
          'Kerala PSC Scientific Officer / Food Safety Officer',
          'UPSC Civil Services / Indian Forest Service (IFS)',
          'Banking Exams (SBI PO, IBPS SO - Agriculture Specialist)'
        ],
        privateRoles: [
          'R&D Chemist / Laboratory Technologist',
          'Quality Control Manager',
          'Biotech Lab Researcher',
          'Data Scientist / Statistical Analyst',
          'Agronomist / Farm Manager'
        ],
        higherStudies: [
          'M.Sc at Central Universities / IITs (via IIT-JAM)',
          'Integrated PhD at IISc / IISERs',
          'B.Ed (for High School and Higher Secondary teaching)',
          'MBA / PGDM'
        ]
      },
      {
        id: 'bca',
        name: 'BCA (Bachelor of Computer Applications)',
        description: 'Undergraduate degree focused on software development, computer systems, networks, and databases, with less emphasis on core physics/math compared to B.Tech.',
        duration: '3 Years',
        govExams: [
          'Kerala PSC IT Officer / System Administrator',
          'Staff Selection Commission (SSC) Scientific Assistant',
          'National Informatics Centre (NIC) Scientific Technical Assistant'
        ],
        privateRoles: [
          'Full-Stack Web Developer',
          'Cloud Solutions Associate',
          'Database Administrator',
          'QA Engineer / Software Tester',
          'IT Support Engineer'
        ],
        higherStudies: [
          'MCA (Master of Computer Applications)',
          'M.Sc in Computer Science / Data Science',
          'MBA (Information Technology)',
          'Post Graduate Diploma in Cybersecurity'
        ]
      }
    ]
  },
  {
    stream: 'Arts',
    title: 'Humanities & Fine Arts',
    description: 'A pathway exploring human culture, history, language, philosophy, social structures, and creative expression. Ideal for students with strong communication, writing, analytical, or artistic abilities.',
    suitableFor: 'Creative writers, artists, social researchers, journalists, public relations enthusiasts, and students passionate about languages, literature, and social reform.',
    degrees: [
      {
        id: 'ba_humanities',
        name: 'B.A (English, Economics, Political Science, History, Psychology)',
        description: 'Undergraduate degrees in core humanities disciplines, providing excellent communication, writing, critical thinking, and social research skills.',
        duration: '3 to 4 Years',
        govExams: [
          'UPSC Civil Services Exam (IAS, IPS, IFS)',
          'Kerala PSC KAS (Kerala Administrative Service)',
          'Kerala PSC Secretariat Assistant / Block Development Officer (BDO)',
          'UGC NET (for College Professor recruitment)',
          'Bank PO & Clerk Exams'
        ],
        privateRoles: [
          'Content Writer / Copywriter',
          'Corporate Trainer / HR Generalist',
          'Economic Policy Consultant',
          'Public Relations (PR) Specialist',
          'Counselor / Behavioral Coach (with Psychology specialization)'
        ],
        higherStudies: [
          'M.A (Master of Arts) in specialized disciplines',
          'B.Ed (Bachelor of Education - essential for teaching careers)',
          'MSW (Master of Social Work)',
          'LLB (3-Year Law program after graduation)'
        ]
      },
      {
        id: 'bfa',
        name: 'BFA (Bachelor of Fine Arts)',
        description: 'A highly creative, hands-on degree focusing on painting, sculpture, applied arts, graphic design, and printmaking.',
        duration: '4 Years',
        govExams: [
          'Kerala PSC Art Teacher (Government Schools)',
          'Designer / Artist roles in Kerala Tourism & PRD',
          'National Museum / Cultural Centres Curator'
        ],
        privateRoles: [
          'Graphic Designer / Illustrator',
          'UI/UX Designer for Web & Apps',
          'Concept Artist for Gaming & Animation Studios',
          'Art Director / Visualizer in Advertising',
          'Professional Studio Artist / Curator'
        ],
        higherStudies: [
          'MFA (Master of Fine Arts)',
          'Post Graduate Diploma in Animation / VFX',
          'PG Diploma in Industrial Design (NID)',
          'Masters in Art Conservation'
        ]
      },
      {
        id: 'ba_jmc',
        name: 'B.A in Journalism & Mass Communication (BJMC)',
        description: 'Professional training in media, broadcast journalism, reporting, public relations, digital media, and audio-visual production.',
        duration: '3 Years',
        govExams: [
          'Kerala PSC Information Officer (PRD - Public Relations Dept)',
          'All India Radio (AIR) Producer / News Reader',
          'Doordarshan News Reporter / Editor',
          'UPSC Central Information Service'
        ],
        privateRoles: [
          'News Anchor / Print Reporter',
          'Digital Content Creator / Video Journalist',
          'Social Media Manager',
          'Corporate Communications Officer',
          'Copywriter in Advertising Agencies'
        ],
        higherStudies: [
          'M.A in Mass Communication / Film Studies',
          'PG Diploma from IIMC (Indian Institute of Mass Communication)',
          'MBA in Media & Entertainment',
          'PG Diploma in Broadcast Journalism'
        ]
      }
    ]
  },
  {
    stream: 'Commerce',
    title: 'Commerce & Management',
    description: 'A stream focusing on business, finance, accounting, taxation, economics, trade, and industrial organization. Excellent for students with mathematical comfort, organized work ethics, and business interest.',
    suitableFor: 'Budding entrepreneurs, financial analysts, accountants, managers, lawyers, and students intrigued by trading, corporate finance, and business law.',
    degrees: [
      {
        id: 'bcom',
        name: 'B.Com (Bachelor of Commerce)',
        description: 'The standard business degree with optional specializations in Finance, Tax, Computer Applications, Co-operation, or Banking.',
        duration: '3 Years',
        govExams: [
          'Kerala PSC Divisional Accountant (Water Authority, KSEB)',
          'Kerala PSC Co-operative Inspector / Auditor',
          'SSC CGL Comptroller & Auditor General (CAG) Auditor',
          'Bank PO & Clerk (SBI, Federal Bank, Kerala Bank)',
          'LIC AAO (Assistant Administrative Officer)'
        ],
        privateRoles: [
          'Tax Consultant / Tax Analyst',
          'Financial Analyst / Investment Specialist',
          'Accountant / Audit Assistant',
          'Credit Analyst in Commercial Banks',
          'Portfolio Manager Associate'
        ],
        higherStudies: [
          'CA (Chartered Accountancy) via ICAI',
          'CMA (Cost & Management Accountant) or CS (Company Secretary)',
          'M.Com (Master of Commerce)',
          'MBA / PGDM (Finance/Analytics)',
          'Global credentials like ACCA / CPA'
        ]
      },
      {
        id: 'bba',
        name: 'BBA / BMS (Bachelor of Business Administration / Management Studies)',
        description: 'A management-centric undergraduate degree that develops leadership, operational strategy, marketing skills, and startup orientation.',
        duration: '3 Years',
        govExams: [
          'Management Trainee in Public Sector Undertakings (PSUs)',
          'Kerala PSC Administrative Officers',
          'UPSC Civil Services'
        ],
        privateRoles: [
          'Business Development Executive',
          'Marketing Analyst / Brand Executive',
          'HR Specialist / Recruiter',
          'Operations Associate',
          'Management Consultant Trainee'
        ],
        higherStudies: [
          'MBA at top tier B-Schools (via CAT / XAT / CMAT / KMAT)',
          'PG Diploma in Data Science or Business Analytics',
          'Masters in International Business (MIB) in India or abroad',
          'Postgraduate Course in Digital Marketing'
        ]
      },
      {
        id: 'integrated_law',
        name: 'Integrated Law (B.Com LLB / B.A LLB / BBA LLB)',
        description: 'A 5-year combined professional course integrating a traditional undergraduate degree with a professional Law degree.',
        duration: '5 Years (After Class 12)',
        govExams: [
          'Kerala Judicial Services Exam (for Munsiff Magistrate)',
          'Kerala PSC Public Prosecutor / Legal Advisor',
          'UPSC Legal Specialist / Officer in Armed Forces (JAG branch)',
          'Law Officer in SEBI / RBI / Public Sector Banks'
        ],
        privateRoles: [
          'Corporate Lawyer in Law Firms',
          'Legal Counsel / Consultant for Tech & Business Corporates',
          'Independent Practicing Advocate (High Court/District Courts)',
          'Arbitrator / Mediator',
          'Compliance Officer'
        ],
        higherStudies: [
          'LL.M (Master of Laws) at NLUs (National Law Universities via CLAT PG)',
          'PhD in Law / International Law',
          'Specialized Diploma in Intellectual Property Rights (IPR)'
        ]
      }
    ]
  },
  {
    stream: 'Vocational',
    title: 'Vocational & Technical Studies',
    description: 'A hands-on, job-oriented pathway focusing on industry-specific craft skills, technical training, hospitality, agricultural skills, and vocational applications. Perfect for early employment and practical learners.',
    suitableFor: 'Practical thinkers, tech enthusiasts, hands-on builders, craftsmen, entrepreneurs looking to launch services, and students wanting rapid career entry.',
    degrees: [
      {
        id: 'bvoc',
        name: 'B.Voc (Bachelor of Vocational Education)',
        description: 'NEP-aligned highly practical degree in sectors like Software Development, Tourism & Hospitality, Renewable Energy, Food Processing, or Automobile Technology.',
        duration: '3 Years (Multiple Exit options - Diploma, Adv. Diploma, Degree)',
        govExams: [
          'Technical Assistant in Government Departments',
          'PSC Supervisor in Government Food Processing units / Agricultural farms',
          'Railway Recruitment Board Technician'
        ],
        privateRoles: [
          'Full-Stack Developer (B.Voc Software Dev)',
          'Solar Energy Installation & Maintenance Engineer',
          'Hotel / Restaurant Operations Manager',
          'Automotive Diagnostic Technician',
          'Agricultural Consultant'
        ],
        higherStudies: [
          'M.Voc (Master of Vocational Education)',
          'MBA (Operations / Hospitality / Systems)',
          'Project Management Certifications (PMP)',
          'Specialized technical training programs'
        ]
      },
      {
        id: 'poly_diploma',
        name: 'Polytechnic Diploma in Engineering',
        description: 'A 3-year diploma in engineering branches (Computer, Civil, Mechanical, Electrical, Automobile, Electronics) available immediately after Class 10 or Class 12.',
        duration: '3 Years (After Class 10/12)',
        govExams: [
          'Kerala PSC Sub Engineer in KSEB (Electricity Board)',
          'Kerala PSC Overseer Grade I/II/III in PWD & Irrigation Dept',
          'Railway Recruitment Board (RRB) Junior Engineer (JE)',
          'DRDO / ISRO / BARC Technical Assistant',
          'SSC Junior Engineer'
        ],
        privateRoles: [
          'Plant Maintenance Supervisor',
          'Quality Control Inspector',
          'CAD/CAM Drafting Designer',
          'Production Engineer in Manufacturing plants',
          'Automobile Service Workshop Manager'
        ],
        higherStudies: [
          'Lateral Entry into B.Tech (Direct 2nd year admission via LET exam)',
          'Advanced PG Diplomas in Automation / Robotics / Piping Engineering',
          'AMIE certification (equivalent to B.E/B.Tech)'
        ]
      },
      {
        id: 'iti_trade',
        name: 'ITI Certificate Trades (Draftsman, Electrician, Fitter, Welder, Machinist)',
        description: 'Highly specialized, practical training trades focused on immediate industrial craftsmanship, mechanical repairs, or wiring certificates.',
        duration: '1 to 2 Years (After Class 10)',
        govExams: [
          'KSEB Lineman / Assistant',
          'KSRTC Mechanic / Artisan Grade',
          'Technician roles in Southern Railways & Metro systems',
          'Government ITI Instructor (with experience)',
          'Military / Ordinance Factory Technician'
        ],
        privateRoles: [
          'Industrial Electrician',
          'CNC Machine Operator',
          'Automobile / Diesel Mechanic',
          'HVAC (AC & Refrigeration) Technician',
          'Independent Contractor / Workshop Owner'
        ],
        higherStudies: [
          'Apprenticeship Training (NAC certificate by NCVT)',
          'Diploma in Engineering (Lateral admission to Polytechnic 2nd year)',
          'CITS (Craft Instructor Training Scheme) for teacher training'
        ]
      }
    ]
  }
];
