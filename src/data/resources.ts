import { AdmissionDeadline, EduResource } from '../types';

export const baselineDeadlines: AdmissionDeadline[] = [
  {
    id: 'hscap',
    title: 'HSCAP Single Window Plus One (Class 11) Admission',
    portal: 'Directorate of General Education, Kerala',
    date: '2026-06-15',
    status: 'Open',
    link: 'https://www.hscap.kerala.gov.in',
    category: 'Class 10'
  },
  {
    id: 'keam',
    title: 'KEAM Engineering & Pharmacy Entrance Exam Registration',
    portal: 'Office of the Commissioner for Entrance Examinations (CEE)',
    date: '2026-04-10',
    status: 'Closed',
    link: 'https://cee.kerala.gov.in',
    category: 'Class 12'
  },
  {
    id: 'poly_admission',
    title: 'Kerala Polytechnic College Admission Single Window Portal',
    portal: 'Department of Technical Education (DTE), Kerala',
    date: '2026-07-20',
    status: 'Open',
    link: 'https://www.polyadmission.org',
    category: 'Class 10'
  },
  {
    id: 'lbs_allied',
    title: 'LBS Nursing & Allied Health Sciences Admission CAP',
    portal: 'LBS Centre for Science & Technology, Kerala',
    date: '2026-08-05',
    status: 'Upcoming',
    link: 'https://lbscentre.kerala.gov.in',
    category: 'Class 12'
  },
  {
    id: 'ug_cap_calicut',
    title: 'Calicut University Centralised UG Admission Process (UGCAP)',
    portal: 'Directorate of Admissions, Calicut University',
    date: '2026-06-30',
    status: 'Closed',
    link: 'https://admission.uoc.ac.in',
    category: 'Class 12'
  },
  {
    id: 'ug_cap_kerala',
    title: 'Kerala University Centralised UG Admission Process',
    portal: 'University of Kerala Admission Portal',
    date: '2026-07-15',
    status: 'Open',
    link: 'https://admissions.keralauniversity.ac.in',
    category: 'Class 12'
  },
  {
    id: 'vhse_cap',
    title: 'VHSE Single Window Admission (Vocational Stream)',
    portal: 'VHSE Kerala Portal',
    date: '2026-06-25',
    status: 'Closed',
    link: 'https://vhse.kerala.gov.in',
    category: 'Class 10'
  }
];

export const eduResources: EduResource[] = [
  {
    id: 'samagra',
    title: 'Samagra Kerala Resource Portal',
    description: 'The official digital education repository by Kerala Infrastructure and Technology for Education (KITE). Provides digital textbooks, interactive digital assets, and lesson plans.',
    url: 'https://samagra.kite.kerala.gov.in',
    category: 'School Curriculum & Textbooks',
    isFree: true,
    provider: 'KITE, Govt of Kerala'
  },
  {
    id: 'swayam',
    title: 'SWAYAM Central Portal',
    description: 'An initiative by the Ministry of Education, Govt of India, offering high-quality, fully free courses designed by top faculty in India, with credit-transfer options for college.',
    url: 'https://swayam.gov.in',
    category: 'Online College Courses',
    isFree: true,
    provider: 'Ministry of Education, Govt of India'
  },
  {
    id: 'diksha',
    title: 'DIKSHA National Portal',
    description: 'A national platform for school education offering teachers, students, and parents structured learning materials aligned with prescribed school curriculums.',
    url: 'https://diksha.gov.in',
    category: 'School Learning Guides',
    isFree: true,
    provider: 'NCERT / Ministry of Education'
  },
  {
    id: 'ndli',
    title: 'National Digital Library of India (NDLI)',
    description: 'A virtual repository of millions of learning resources, spanning textbooks, research articles, audiobooks, and videos in multiple Indian languages.',
    url: 'https://ndli.iitkgp.ac.in',
    category: 'E-Books & Libraries',
    isFree: true,
    provider: 'IIT Kharagpur'
  },
  {
    id: 'nptel',
    title: 'NPTEL (National Programme on Technology Enhanced Learning)',
    description: 'A joint initiative of IITs and IISc offering free, deep video courses in engineering, mathematics, computer science, and basic sciences.',
    url: 'https://nptel.ac.in',
    category: 'Science & Engineering Video Lectures',
    isFree: true,
    provider: 'IITs & IISc Bangalore'
  },
  {
    id: 'khan_academy',
    title: 'Khan Academy India',
    description: 'A globally acclaimed non-profit platform offering free, world-class interactive exercises, instructional videos, and a personalized learning dashboard.',
    url: 'https://in.khanacademy.org',
    category: 'K-12 Math, Science, & General Prep',
    isFree: true,
    provider: 'Khan Academy (Non-Profit)'
  }
];
