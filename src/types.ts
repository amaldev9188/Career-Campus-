export interface StudentProfile {
  name: string;
  age: string;
  currentClass: 'Class 10' | 'Class 12' | '';
  district: string;
  interests: string[];
}

export interface QuizChoice {
  text: string;
  weights: {
    Arts: number;
    Science: number;
    Commerce: number;
    Vocational: number;
  };
}

export interface QuizQuestion {
  id: number;
  text: string;
  choices: QuizChoice[];
}

export type StreamType = 'Arts' | 'Science' | 'Commerce' | 'Vocational';

export interface DegreeOption {
  id: string;
  name: string;
  description: string;
  duration: string;
  govExams: string[];
  privateRoles: string[];
  higherStudies: string[];
}

export interface StreamCareerData {
  stream: StreamType;
  title: string;
  description: string;
  suitableFor: string;
  degrees: DegreeOption[];
}

export interface College {
  id: string;
  name: string;
  district: string;
  type: 'Arts & Science' | 'Engineering' | 'Polytechnic' | 'Medical' | 'Technical/Vocational' | string;
  contactPhone: string;
  contactEmail: string;
  website: string;
  address: string;
  popularCourses: string[];
  email?: string;
  phone?: string;
  medium?: string;
  notes?: string;
}

export interface AdmissionDeadline {
  id: string;
  title: string;
  portal: string;
  date: string;
  status: 'Open' | 'Upcoming' | 'Closed';
  link: string;
  category: 'Class 10' | 'Class 12' | 'All' | 'Scholarships';
}

export interface EduResource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  isFree: boolean;
  provider: string;
}
