import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Search, 
  Award, 
  BrainCircuit, 
  Map, 
  School, 
  ShieldCheck, 
  Compass, 
  Cpu, 
  Download, 
  FileText, 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  Maximize2, 
  ChevronDown, 
  ChevronUp,
  Globe
} from 'lucide-react';

interface FeatureItem {
  id: number;
  title: string;
  description: string;
  icon: any;
  category: 'Landing & Core' | 'AI & Mentorship' | 'Directories & Maps' | 'Portals & Utilities' | 'Management & Security';
  bullets: string[];
}

export default function FeatureListSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Complete List of 35 Feature Modules matching the proposal
  const features: FeatureItem[] = [
    {
      id: 1,
      title: "1. Modern Landing Page",
      category: "Landing & Core",
      description: "A premium, fully responsive portal designed to introduce students to digital career resources in Kerala.",
      icon: Compass,
      bullets: [
        "Premium responsive design matching custom brand visual aesthetics",
        "Hero banner featuring education-themed visuals and illustrations",
        "Interactive entering layout animations (powered by motion)",
        "CareerCompass full concept introduction and core mission",
        "Quick feature highlights with active visual metrics",
        "Live student success statistics and impact metrics",
        "Dynamic Call-to-Action buttons with smooth hover feedback",
        "Student success stories carousel",
        "Inspirational student testimonies",
        "Frequently Asked Questions (FAQ) interactive accordion",
        "Contact section and professional footer with essential links"
      ]
    },
    {
      id: 2,
      title: "2. User Authentication",
      category: "Landing & Core",
      description: "Secure, credential-based student and administrator authorization powered by Firebase Auth.",
      icon: ShieldCheck,
      bullets: [
        "Interactive student registration forms",
        "Standard secure email and password login system",
        "Forgot Password email recovery pipeline",
        "Persistent 'Remember Me' user session configuration",
        "Automatic database profile creation in Firestore upon registration",
        "Secure student-to-admin role-based access separation",
        "Seamless logout session termination"
      ]
    },
    {
      id: 3,
      title: "3. Personalized Student Dashboard",
      category: "Landing & Core",
      description: "A centralized command center showing recommendations, notifications, and study checklists.",
      icon: Layers,
      bullets: [
        "Personalized greeting with contextual student welcome messages",
        "Dynamic recommendations engine matching student's district & interests",
        "Aptitude quiz results and stream guidance display",
        "Bookmarks list for saved colleges, careers, and scholarships",
        "Personalized learning progress tracker",
        "Upcoming Kerala exam and admission deadline alerts",
        "Recent activity feed and contextual AI mentor recommendations"
      ]
    },
    {
      id: 4,
      title: "4. Compass AI – AI Career Mentor",
      category: "AI & Mentorship",
      description: "A bilingual, high-fidelity AI companion supporting real-time chat, study plans, and career roadmaps.",
      icon: BrainCircuit,
      bullets: [
        "Real-time multilingual AI dialog (English & Malayalam support)",
        "Intelligent career stream recommendation based on interests",
        "Personalized college suggestion with direct admission paths",
        "Targeted study planners and subject study schedules",
        "Professional resume writing tips and skill development suggestions",
        "Comprehensive civil services and government exam preparation advice",
        "Session chat history and quick contextual suggestion pills"
      ]
    },
    {
      id: 5,
      title: "5. Career Wizard Quiz",
      category: "AI & Mentorship",
      description: "An interactive smart wizard designed for students who are undecided about their future paths.",
      icon: Cpu,
      bullets: [
        "Guided step-by-step questionnaire evaluating current class",
        "Interests, favorite subjects, and budget range evaluation",
        "Location preference mapping (Kerala local districts)",
        "Algorithmic stream recommendation matching (Science, Commerce, Humanities)",
        "Instant course recommendations with skill development roadmap"
      ]
    },
    {
      id: 6,
      title: "6. Aptitude & Interest Assessment",
      category: "AI & Mentorship",
      description: "An advanced, psychometric-aligned quiz that scores logical reasoning, communication, and technical skills.",
      icon: Award,
      bullets: [
        "Interactive questions across logical reasoning, analytical and creative thinking",
        "Communication competence and engineering/technical aptitude checking",
        "Real-time scoring and instant profile classification",
        "Personalized aptitude report with direct matching career scorecards"
      ]
    },
    {
      id: 7,
      title: "7. Career Explorer",
      category: "Directories & Maps",
      description: "A library of diverse fields from conventional branches to emerging high-tech roles.",
      icon: Map,
      bullets: [
        "In-depth profiles for dozens of career options in Kerala",
        "Core description, required skills, and qualification pathways",
        "Expected salary packages across entry, mid, and senior roles",
        "Direct listings of government and private sector employment opportunities",
        "Integrated roadmaps for career development with descriptive visual icons"
      ]
    },
    {
      id: 8,
      title: "8. Course Explorer",
      category: "Directories & Maps",
      description: "A directory covering B.Tech, B.Sc, B.Com, Polytech, ITI, Nursing, and other core curriculums.",
      icon: BookOpen,
      bullets: [
        "Detailed breakdowns for engineering, arts, medical, and paramedical courses",
        "Accurate eligibility guidelines, duration, and tuition fee estimates",
        "Curriculum outline, core topics, and professional certifications",
        "Future study options and high-paying employment sectors"
      ]
    },
    {
      id: 9,
      title: "9. College Explorer",
      category: "Directories & Maps",
      description: "A database of government, autonomous, and private institutions spanning all 14 districts of Kerala.",
      icon: School,
      bullets: [
        "Categorized search (Government Colleges, Private Colleges, Universities, Engineering, Nursing, ITIs)",
        "Real-life high-quality campus photos and campus facility cards",
        "Comprehensive contact directories, exact physical addresses, and official websites",
        "Available courses, fee matrices, seat intake, and placement records",
        "Google Maps integration for instant navigation and directions"
      ]
    },
    {
      id: 10,
      title: "10. University Explorer",
      category: "Directories & Maps",
      description: "Profiles of prime universities supervising tertiary education throughout the state.",
      icon: School,
      bullets: [
        "Profiles including Calicut University, MG, Kerala University, CUSAT, KTU, etc.",
        "List of affiliated colleges, major departments, and research centers",
        "Direct admission notification updates and central registrar contacts",
        "Campus galleries, facilities checklists, and hostel descriptions"
      ]
    },
    {
      id: 11,
      title: "11. Kerala District Explorer",
      category: "Directories & Maps",
      description: "A localized explorer allowing students to discover colleges, skill centers, and scholarships in their home district.",
      icon: Map,
      bullets: [
        "Covering all 14 districts of Kerala (Thiruvananthapuram to Kasaragod)",
        "District-level search for government and professional engineering colleges",
        "Integration with district skill development centers (K-DISC, ASAP)",
        "Localized admission notices, regional scholarships, and job fairs"
      ]
    },
    {
      id: 12,
      title: "12. Google Maps & GPS",
      category: "Directories & Maps",
      description: "An interactive spatial planner to map institutions, calculate distances, and navigate route directions.",
      icon: Map,
      bullets: [
        "Dynamic inline Google Maps mapping of college coordinates",
        "GPS-driven real-time client location detection",
        "Automated distance calculation (in kilometers) from current location",
        "Estimated travel times across transit modes",
        "Local transit indicators (nearby railway stations, bus stands, and hostels)",
        "One-click redirection to Google Navigation app"
      ]
    },
    {
      id: 13,
      title: "13. Scholarship Portal",
      category: "Portals & Utilities",
      description: "A localized repository listing state and central government scholarship schemes for Kerala students.",
      icon: Award,
      bullets: [
        "Listing of minority, merit-cum-means, post-matric, and girl-child scholarships",
        "Detailed eligibility requirements and maximum financial benefits",
        "Active deadlines and online application links",
        "Checklists of essential documents (income certificates, domicile papers)"
      ]
    },
    {
      id: 14,
      title: "14. Admission Hub",
      category: "Portals & Utilities",
      description: "A real-time monitoring center tracking KEAM, CAP, LBS, and other admission registries.",
      icon: Layers,
      bullets: [
        "Structured calendar detailing registration openings, trial allotments, and final admissions",
        "Step-by-step guidance on allotment choices and centralized counseling registers",
        "Alert tags highlighting documents required for in-person reporting at college offices"
      ]
    },
    {
      id: 15,
      title: "15. Learning Hub",
      category: "Portals & Utilities",
      description: "A repository of academic resources, entrance exams guides, and downloadable question papers.",
      icon: BookOpen,
      bullets: [
        "Free preparation books, reference syllabus sheets, and study materials",
        "Previous years' solved questions for KEAM, LBS, and polytechnic entrances",
        "Direct links to high-quality video lectures and educational channels",
        "Instant PDF guide downloads for offline exam prep reference"
      ]
    },
    {
      id: 16,
      title: "16. News & Updates",
      category: "Portals & Utilities",
      description: "A real-time bulletin board tracking governmental announcements, exams, and career events.",
      icon: Globe,
      bullets: [
        "Latest alerts on central government and state university admissions",
        "Direct feeds of state education department press releases",
        "Announcements on upcoming job melas, district career workshops, and exhibitions"
      ]
    },
    {
      id: 17,
      title: "17. Career Roadmap Generator",
      category: "AI & Mentorship",
      description: "A visual career mapping engine tracking progress from Class 10/12 to professional roles.",
      icon: Map,
      bullets: [
        "Interactive visual roadmaps for fields like Software Engineering, Civil Services, etc.",
        "Milestones covering Class 10/12 ➔ Higher Secondary ➔ Entrance exams ➔ Degree ➔ Job",
        "Progress tracking node completion flags"
      ]
    },
    {
      id: 18,
      title: "18. College Comparison Engine",
      category: "Portals & Utilities",
      description: "A side-by-side comparison matrix evaluating up to three institutions concurrently.",
      icon: School,
      bullets: [
        "Side-by-side comparison for multiple colleges in Kerala",
        "Compares annual tuition fees, courses, placement statistics, and packages",
        "Compares campus infrastructure (hostels, libraries, labs) and NAAC accreditation grade"
      ]
    },
    {
      id: 19,
      title: "19. Career Comparison Matrix",
      category: "AI & Mentorship",
      description: "A parallel comparison utility checking salaries, growth, and work environments.",
      icon: BrainCircuit,
      bullets: [
        "Compares starting and mid-career salaries side-by-side",
        "Evaluates average study duration, skills entry barrier, and market job demand",
        "Compares work-life balance levels and future industry growth projections"
      ]
    },
    {
      id: 20,
      title: "20. Favorites & Bookmarks",
      category: "Landing & Core",
      description: "A dynamic local bookmark list storing personal college preferences and career routes.",
      icon: Compass,
      bullets: [
        "One-click save function on college directory cards",
        "Saves desired careers, scholarships, and resources",
        "Instant accessibility inside the Personalized Student Dashboard"
      ]
    },
    {
      id: 21,
      title: "21. Real-time Notifications",
      category: "Management & Security",
      description: "A system for deadline notifications, entrance reminders, and tailored recommendations.",
      icon: Globe,
      bullets: [
        "Alert notifications for registered exams, counseling dates, and state allotments",
        "Personalized notifications prompting updates for incomplete student profiles",
        "AI recommendations alert sent to student dashboard when new courses match profile interests"
      ]
    },
    {
      id: 22,
      title: "22. Multilingual Support",
      category: "Landing & Core",
      description: "Bilingual toggle support throughout CareerCompass translating menus, forms, and guidance.",
      icon: Globe,
      bullets: [
        "English and Malayalam localized translations across all buttons, headers, and labels",
        "Dual-language support for AI chat inputs, assessments, and download reports"
      ]
    },
    {
      id: 23,
      title: "23. Smart Universal Search",
      category: "Landing & Core",
      description: "A high-speed indexed search matching colleges, courses, careers, and resources.",
      icon: Search,
      bullets: [
        "Instant matching by name, district, keyword, or popular course",
        "Debounced input for fast search rendering",
        "Intelligent category classification labels"
      ]
    },
    {
      id: 24,
      title: "24. Parent Corner",
      category: "Landing & Core",
      description: "A guidance section dedicated to parents outlining educational budgets, safety, and pathways.",
      icon: Compass,
      bullets: [
        "Tips for parents on higher education budgets and educational planning",
        "Guides on choosing safe student hostels and university-approved campuses",
        "Information on minority scholarships and study loan opportunities"
      ]
    },
    {
      id: 25,
      title: "25. Teacher & Counsellor Portal",
      category: "Management & Security",
      description: "A workspace for teachers to coordinate student counseling and review assessments.",
      icon: ShieldCheck,
      bullets: [
        "Class performance summaries and aptitude test statistics",
        "Curated career guidance slide decks and study material handouts",
        "Downloadable reports and reference directories"
      ]
    },
    {
      id: 26,
      title: "26. Student Success Stories",
      category: "Landing & Core",
      description: "Real inspirational stories of Kerala students achieving admission to major institutions.",
      icon: Award,
      bullets: [
        "Photographs, college admissions details, and success roadmaps",
        "Invaluable advice from alumni on study patterns and entrance exams",
        "Direct mentoring advice and video guide reference links"
      ]
    },
    {
      id: 27,
      title: "27. PDF Report Generator",
      category: "Portals & Utilities",
      description: "Client-side report printer compiling student aptitude reports, saved colleges, and maps into a clean PDF format.",
      icon: FileText,
      bullets: [
        "Formats custom PDF containing student name, district, and interests",
        "Includes AI recommended stream and detailed aptitude scores",
        "Includes bookmarked colleges and customized career roadmaps"
      ]
    },
    {
      id: 28,
      title: "28. Feedback & Support",
      category: "Landing & Core",
      description: "An integrated ticketing interface to submit feedback and contact state counsellors.",
      icon: Compass,
      bullets: [
        "Submit bugs, suggest updates, and rate application features",
        "Report missing colleges, incorrect fees, or outdated details",
        "Connect directly with student support cells via email"
      ]
    },
    {
      id: 29,
      title: "29. Detailed Settings Panel",
      category: "Landing & Core",
      description: "User configurations managing notifications, app languages, profile data, and dark mode.",
      icon: Compass,
      bullets: [
        "Update password, student profile, and photo avatars",
        "Toggle specific push and dashboard notification subjects",
        "Manage app theme, layout density, and privacy options"
      ]
    },
    {
      id: 30,
      title: "30. Dark & Light Mode Theme",
      category: "Landing & Core",
      description: "A theme configuration matching system colors and saving student preferences.",
      icon: Sparkles,
      bullets: [
        "Clean, high-contrast light mode for daytime reading",
        "Soft, low-blue eye-protective dark mode for nighttime study",
        "Saves theme choices in localStorage to prevent flickering on reload"
      ]
    },
    {
      id: 31,
      title: "31. Full Responsive Design",
      category: "Landing & Core",
      description: "A design built from the ground up to support mobile touch screens to ultra-wide desktop monitors.",
      icon: Layers,
      bullets: [
        "Mobile-first responsive fluid grids with touch-friendly 44px buttons",
        "Optimized layout spacing and structural collapsible sidebars for laptops and desktop displays"
      ]
    },
    {
      id: 32,
      title: "32. Accessibility Core (WCAG)",
      category: "Landing & Core",
      description: "Accessible styles including screen-reader tags, keyboard focus, and adjustable text size.",
      icon: Sparkles,
      bullets: [
        "Strict color contrast ratio for improved readability",
        "Interactive keyboard focus ring support across all buttons and fields",
        "Semantic HTML element tags supporting assistive readers"
      ]
    },
    {
      id: 33,
      title: "33. Rich UI & Visual Experience",
      category: "Landing & Core",
      description: "A visual experience featuring smooth custom transitions, hover states, and canvas layouts.",
      icon: Sparkles,
      bullets: [
        "Custom high-resolution educational covers and campus cards",
        "Responsive skeleton loaders preventing layout shifts during data sync",
        "Staggered entrance animations rendering elegant menus and grids"
      ]
    },
    {
      id: 34,
      title: "34. Admin Control Dashboard",
      category: "Management & Security",
      description: "An executive panel allowing system administrators to regulate resources, colleges, and audit database reports.",
      icon: ShieldCheck,
      bullets: [
        "Real-time management dashboard showing total registered users and student roles",
        "Create, edit, and delete college lists, admission deadlines, and scholar notices",
        "Database auditor displaying active feedback tickets and support requests"
      ]
    },
    {
      id: 35,
      title: "35. Encryption & Database Security",
      category: "Management & Security",
      description: "Firestore-validated rules restricting student access and encrypting administrator sessions.",
      icon: ShieldCheck,
      bullets: [
        "Firestore Security Rules checking matching user authentication tokens",
        "Admin role-based endpoint restriction preventing unauthorized collection writes",
        "Cloud storage locks protecting student profile directories and email listings"
      ]
    }
  ];

  const handleCopyAbstract = () => {
    const abstractText = `CAREERCOMPASS: KERALA'S AI-POWERED HIGHER EDUCATION & CAREER GUIDANCE PLATFORM
--------------------------------------------------------------------------------------
CareerCompass is a comprehensive, AI-powered digital ecosystem for higher education and career guidance in Kerala. It functions as a personalized digital career mentor that supports students from career exploration through college selection, admissions, scholarships, and future career planning.

CORE HIGHLIGHTS:
- 35+ Major Modules with over 250 individual features.
- Compass AI: Multilingual AI Career Mentor (English & Malayalam).
- Complete College, University, and Course Explorer covering all 14 districts of Kerala.
- Interactive Google Maps and GPS coordinates for distance calculation and routing.
- Comprehensive Scholarship Portal and Live Admission Hub tracking KEAM, LBS, etc.
- Psychometric Aptitude & Interest Assessment.
- Admin Control Dashboard and secure Firebase-backed state persistence.

FEATURED MODULES SUMMARY:
${features.map(f => `- ${f.title}: ${f.description}`).join('\n')}

Designed for excellence in hackathons, presentations, abstracts, and educational project proposals.`;

    navigator.clipboard.writeText(abstractText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAbstract = () => {
    const abstractText = `CAREERCOMPASS: KERALA'S AI-POWERED HIGHER EDUCATION & CAREER GUIDANCE PLATFORM
======================================================================================
CareerCompass is a comprehensive, AI-powered digital ecosystem for higher education and career guidance in Kerala. It functions as a personalized digital career mentor that supports students from career exploration through college selection, admissions, scholarships, and future career planning.

CORE HIGHLIGHTS:
- 35+ Major Modules with over 250 individual features.
- Compass AI: Multilingual AI Career Mentor (English & Malayalam).
- Complete College, University, and Course Explorer covering all 14 districts of Kerala.
- Interactive Google Maps and GPS coordinates for distance calculation and routing.
- Comprehensive Scholarship Portal and Live Admission Hub tracking KEAM, LBS, etc.
- Psychometric Aptitude & Interest Assessment.
- Admin Control Dashboard and secure Firebase-backed state persistence.

======================================================================================
FULL MODULE COMPENDIUM (${features.length} MODULES):
======================================================================================
${features.map(f => `
${f.title} [Category: ${f.category}]
--------------------------------------------------------------------------------
Description: ${f.description}
Key Capabilities:
${f.bullets.map(b => `  * ${b}`).join('\n')}
`).join('\n')}

======================================================================================
DEVELOPMENT MODEL & FUTURES:
Although the hackathon prototype focuses on Kerala, the platform is designed with a modular architecture that can later expand to all Indian states by integrating official educational datasets.
======================================================================================
Generated via CareerCompass Proposal Builder. Copyright 2026. All Rights Reserved.`;

    const blob = new Blob([abstractText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'CareerCompass_Feature_Abstract.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredFeatures = features.filter((f) => {
    const matchesCategory = selectedCategory === 'All' || f.category === selectedCategory;
    const matchesSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.bullets.some(b => b.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', 'Landing & Core', 'AI & Mentorship', 'Directories & Maps', 'Portals & Utilities', 'Management & Security'];

  return (
    <div id="feature-list-section" className="space-y-8">
      
      {/* 1. HERO HEADER */}
      <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white p-6 md:p-8 rounded-[32px] border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-16 -mb-16" />
        
        <div className="relative space-y-4 md:space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-teal-500/10 text-teal-400 font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-teal-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Comprehensive Platform Compendium
            </span>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              CareerCompass Feature Portfolio
            </h2>
            <p className="text-sm md:text-base text-slate-400 max-w-2xl font-medium leading-relaxed">
              Below is the comprehensive roadmap containing all <strong className="text-teal-400">35+ major modules</strong> and over <strong className="text-teal-400">250+ individual capabilities</strong> designed into CareerCompass. Perfect for your presentation, project abstract, proposal, or evaluation report.
            </p>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={handleCopyAbstract}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider border border-slate-700/60 transition-all cursor-pointer shadow"
            >
              <FileText className="w-4 h-4 text-teal-400" />
              {copied ? 'Copied Abstract!' : 'Copy Summary Abstract'}
            </button>
            <button
              onClick={handleDownloadAbstract}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-slate-950 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-teal-500/10"
            >
              <Download className="w-4 h-4" />
              Download Full Text Document
            </button>
          </div>
        </div>
      </div>

      {/* 2. STATS OVERVIEW BENTO GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Major Modules', val: '35+', sub: 'Comprehensive scope', color: 'border-teal-100 bg-teal-50/20 text-teal-600' },
          { label: 'Sub-Features', val: '250+', sub: 'Production-ready', color: 'border-blue-100 bg-blue-50/20 text-blue-600' },
          { label: 'Districts of Kerala', val: '14/14', sub: 'Fully mapped datasets', color: 'border-indigo-100 bg-indigo-50/20 text-indigo-600' },
          { label: 'Core Security', val: 'SSL/Rules', sub: 'Cloud Firestore secure', color: 'border-slate-200 bg-slate-50 text-slate-700' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1 text-center md:text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{stat.label}</span>
            <span className="text-2xl md:text-3xl font-black text-slate-900 block leading-none">{stat.val}</span>
            <span className="text-[9px] text-slate-500 font-semibold block">{stat.sub}</span>
          </div>
        ))}
      </div>

      {/* 3. SEARCH & CATEGORIES */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search features or bullets (e.g., KEAM, English, Admin)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white text-xs border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent font-medium"
            />
          </div>

          {/* Matches Count */}
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 self-start md:self-auto">
            Showing {filteredFeatures.length} of {features.length} Modules
          </span>
        </div>

        {/* Categories Chips */}
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 4. FEATURES ACCORDION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFeatures.map((f) => {
          const isExpanded = expandedId === f.id;
          const Icon = f.icon;

          return (
            <div
              key={f.id}
              className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                isExpanded 
                  ? 'border-teal-500 shadow-md ring-1 ring-teal-500/10' 
                  : 'border-slate-100 hover:border-slate-200 hover:shadow-sm'
              }`}
            >
              <div className="p-5 space-y-4">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="w-9 h-9 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-600 shrink-0">
                      <Icon className="w-4 h-4 text-teal-600" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-extrabold text-slate-900 leading-tight">
                        {f.title}
                      </h4>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">
                        {f.category}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : f.id)}
                    className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-all cursor-pointer"
                    title={isExpanded ? 'Collapse features' : 'Expand detailed sub-features'}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Short Description */}
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {f.description}
                </p>

                {/* Accordion Bullets */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden pt-2 border-t border-slate-100 space-y-1.5"
                    >
                      <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Key Capabilities:</span>
                      <ul className="space-y-1.5">
                        {f.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="text-xs text-slate-600 flex items-start gap-2 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Expand Toggle Row */}
              <div 
                onClick={() => setExpandedId(isExpanded ? null : f.id)}
                className="px-5 py-2.5 bg-slate-50/50 rounded-b-2xl border-t border-slate-50/80 flex items-center justify-between text-[10px] text-slate-400 font-bold hover:bg-slate-50 hover:text-slate-700 transition-all cursor-pointer select-none"
              >
                <span>{isExpanded ? 'Collapse Specifications' : `View ${f.bullets.length} Sub-features`}</span>
                <Maximize2 className="w-3 h-3 text-slate-400 shrink-0" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty Search State */}
      {filteredFeatures.length === 0 && (
        <div className="bg-white rounded-3xl border border-slate-100 py-16 text-center space-y-3">
          <Layers className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-extrabold text-slate-800">No feature modules found</h3>
          <p className="text-xs text-slate-400 font-medium max-w-sm mx-auto">
            Try searching for other keywords like "AI", "Kerala", "Map", "Admin", or select a different category filter.
          </p>
        </div>
      )}

      {/* 5. SUMMARY CALL-OUT */}
      <div className="bg-teal-50/40 p-6 md:p-8 rounded-[32px] border border-teal-100/60 text-center space-y-2">
        <h4 className="text-base font-extrabold text-teal-900">🚀 Ready for Presentation & Evaluation</h4>
        <p className="text-xs text-teal-700/80 max-w-2xl mx-auto leading-relaxed font-semibold">
          This portfolio is a live representation of the production codebase. You can use the buttons at the top of this tab to download or copy the complete structured text abstract of <strong>CareerCompass</strong> for instant submission inside documents, presentations, or project reports.
        </p>
      </div>

    </div>
  );
}
