import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Compass, 
  BrainCircuit, 
  School, 
  MapPin, 
  GraduationCap, 
  Calendar, 
  Award, 
  BookOpen, 
  Search, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Play, 
  Layers, 
  Users, 
  MessageSquare,
  Globe,
  Heart,
  FileText
} from 'lucide-react';

interface HomeDashboardSectionProps {
  profile: any;
  userProfile: any;
  recommendedStream: string | null;
  activeLanguage: 'EN' | 'ML';
  onLanguageToggle: () => void;
  onNavigateToTab: (tabId: string) => void;
}

export default function HomeDashboardSection({
  profile,
  userProfile,
  recommendedStream,
  activeLanguage,
  onLanguageToggle,
  onNavigateToTab
}: HomeDashboardSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);

  // Dynamic Journey Progress Checklist Calculation
  const [journeySteps, setJourneySteps] = useState([
    { id: 'profile', key: 'profile_done', label: 'Complete Profile Details', desc: 'Add class, district, and interests', checked: false, tab: 'profile' },
    { id: 'quiz', key: 'quiz_done', label: 'Take Aptitude Assessment', desc: 'Identify your baseline academic stream', checked: false, tab: 'quiz' },
    { id: 'discovery', key: 'discovery_done', label: 'Run AI Career Discovery', desc: 'Get personalized Gemini predictions', checked: false, tab: 'wizard' },
    { id: 'chat', key: 'chat_done', label: 'Consult Compass AI', desc: 'Have a chat with your bilingual mentor', checked: false, tab: 'chat' },
    { id: 'explorer', key: 'explorer_done', label: 'Explore Careers & Courses', desc: 'Browse pathways, salaries & syllabus', checked: false, tab: 'explorer' },
    { id: 'colleges', key: 'colleges_done', label: 'Find Nearby Colleges', desc: 'Map local institutions and hostels', checked: false, tab: 'explorer' },
    { id: 'scholarships', key: 'scholarships_done', label: 'Check Scholarships', desc: 'Run the AI eligibility schemes checker', checked: false, tab: 'scholarships' },
    { id: 'report', key: 'report_done', label: 'Download Career Report', desc: 'Generate custom counseling summary PDF', checked: false, tab: 'learning' },
  ]);

  useEffect(() => {
    // Dynamically check completed actions
    const hasProfile = !!(profile?.name && profile?.district && profile?.currentClass);
    const hasQuiz = !!recommendedStream;
    const hasDiscovery = localStorage.getItem('career_compass_wizard_result') !== null;
    const hasChat = localStorage.getItem('career_compass_chat_active') !== null;
    const hasExplorer = localStorage.getItem('career_compass_explorer_viewed') !== null;
    const hasColleges = localStorage.getItem('career_compass_colleges_searched') !== null;
    const hasScholarships = localStorage.getItem('career_compass_scholarships_checked') !== null;
    const hasReport = localStorage.getItem('career_compass_report_downloaded') !== null;

    setJourneySteps(prev => prev.map(step => {
      let isDone = false;
      if (step.id === 'profile') isDone = hasProfile;
      else if (step.id === 'quiz') isDone = hasQuiz;
      else if (step.id === 'discovery') isDone = hasDiscovery;
      else if (step.id === 'chat') isDone = hasChat;
      else if (step.id === 'explorer') isDone = hasExplorer;
      else if (step.id === 'colleges') isDone = hasColleges;
      else if (step.id === 'scholarships') isDone = hasScholarships;
      else if (step.id === 'report') isDone = hasReport;

      return { ...step, checked: isDone };
    }));
  }, [profile, recommendedStream]);

  const completedCount = journeySteps.filter(s => s.checked).length;
  const progressPercent = Math.round((completedCount / journeySteps.length) * 100);

  // Success Stories
  const successStories = [
    {
      name: 'Anjali R. Nair',
      district: 'Kozhikode',
      college: 'College of Engineering Trivandrum (CET)',
      career: 'Full-Stack Developer @ Infopark',
      quote: 'CareerCompass helped me realize that my logical reasoning scores and creative interests were a perfect fit for Computer Science. The KEAM guidance notes were a lifesaver!',
      img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      tag: 'Science Pathway'
    },
    {
      name: 'Rahul Krishnan',
      district: 'Thrissur',
      college: 'Govt. Arts & Science College, Kozhikode',
      career: 'Financial Analyst',
      quote: 'I was completely lost in Class 12, doubting if I should take Science or Commerce. The Compass AI wizard matched me to Economics. Today, I am happy, doing what I love, with a minority scholarship!',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      tag: 'Commerce Pathway'
    },
    {
      name: 'Fathima Nishad',
      district: 'Ernakulam',
      college: 'Government Polytechnic College, Kalamassery',
      career: 'Automation Technician',
      quote: 'Through the Vocational and ITI filter, I found the perfect diploma and secured a fast-track job. My parents were so relieved about the low fee structure mapped here.',
      img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      tag: 'Vocational Pathway'
    }
  ];

  // Quick translation dictionary
  const dict = {
    EN: {
      welcome: "Welcome to CareerCompass",
      tagline: "Discover Yourself. Choose Wisely. Build Your Future.",
      subtitle: "Kerala's leading AI-powered educational portal guiding students from school to active high-paying careers in government and tech ecosystems.",
      exploreBtn: "Start Exploring Now",
      watchDemo: "Watch App Demo",
      activeDistrict: "District",
      grade: "Grade",
      journeyTitle: "My Journey Timeline Tracker",
      journeySubtitle: "Complete interactive milestones to unlock your high-fidelity career path",
      whyTitle: "Why Choose CareerCompass Kerala?",
      whySubtitle: "Bridging structural gaps in professional career counseling across all 14 districts",
      probTitle: "The Problem We Solve",
      probDesc: "Over 85% of Kerala state board students lack direct, structured counseling, leading to random college admissions, heavy education debts, and career mismatches.",
      solTitle: "The Compass Solution",
      solDesc: "A server-side AI mentor paired with exhaustive local university databases, verified government fees, and automated scholarship checks.",
      statsTitle: "Success Statistics",
      successTitle: "Student Success Stories",
      contactMentor: "Ask Compass AI Counselor",
      searchPlaceholder: "Search courses, government colleges, careers or scholarships...",
      notSure: "Not sure where to start?",
      notSureBtn: "Try AI Wizard Discovery"
    },
    ML: {
      welcome: "കരിയർ കോമ്പസ്സിലേക്ക് സ്വാഗതം",
      tagline: "സ്വയം കണ്ടെത്തുക. വിവേകത്തോടെ തിരഞ്ഞെടുക്കുക. ഭാവി കെട്ടിപ്പടുക്കുക.",
      subtitle: "സ്കൂൾ തലത്തിൽ നിന്നും മികച്ച ശമ്പളമുള്ള സർക്കാർ/സാങ്കേതിക കരിയറുകളിലേക്ക് കേരളത്തിലെ വിദ്യാർത്ഥികളെ നയിക്കുന്ന മുൻനിര AI കരിയർ ഗൈഡൻസ് പ്ലാറ്റ്ഫോം.",
      exploreBtn: "തുടങ്ങാം",
      watchDemo: "ഡെമോ കാണുക",
      activeDistrict: "ജില്ല",
      grade: "ക്ലാസ്",
      journeyTitle: "എന്റെ കരിയർ യാത്ര ട്രാക്കർ",
      journeySubtitle: "നിങ്ങളുടെ മികച്ച കരിയർ പാത കണ്ടെത്താൻ താഴെയുള്ള ഘട്ടങ്ങൾ പൂർത്തിയാക്കുക",
      whyTitle: "എന്തുകൊണ്ട് കരിയർകോമ്പസ്സ്?",
      whySubtitle: "കേരളത്തിലെ 14 ജില്ലകളിലുമുള്ള വിദ്യാർത്ഥികൾക്ക് കൃത്യമായ കരിയർ കൗൺസിലിംഗ് നൽകുന്നു",
      probTitle: "ഞങ്ങൾ പരിഹരിക്കുന്ന പ്രശ്നം",
      probDesc: "കേരളത്തിലെ 85%-ലധികം വിദ്യാർത്ഥികൾക്കും ശരിയായ കരിയർ ഗൈഡൻസ് ലഭിക്കുന്നില്ല. ഇത് തെറ്റായ കോഴ്സ് തിരഞ്ഞെടുപ്പുകൾക്കും സാമ്പത്തിക നഷ്ടങ്ങൾക്കും കാരണമാകുന്നു.",
      solTitle: "കോമ്പസ്സ് പരിഹാരം",
      solDesc: "വിദഗ്ദ്ധ കൗൺസിലർമാരുടെ അറിവും വിപുലമായ പ്രാദേശിക സർവ്വകലാശാലാ വിവരങ്ങളും ഒത്തുചേരുന്ന Gemini AI അസിസ്റ്റന്റ്.",
      statsTitle: "യഥാർത്ഥ കണക്കുകൾ",
      successTitle: "വിജയഗാഥകൾ",
      contactMentor: "Compass AI-യോട് ചോദിക്കാം",
      searchPlaceholder: "കോഴ്സുകൾ, ഗവൺമെന്റ് കോളേജുകൾ, സ്കോളർഷിപ്പുകൾ തിരയുക...",
      notSure: "എവിടെ തുടങ്ങണമെന്ന് അറിയില്ലേ?",
      notSureBtn: "AI കരിയർ വിസാർഡ് ട്രൈ ചെയ്യൂ"
    }
  };

  const text = dict[activeLanguage];

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    localStorage.setItem('career_compass_global_query', searchQuery);
    onNavigateToTab('explorer');
  };

  return (
    <div className="space-y-10 animate-fade-in">
      
      {/* LANGUAGE SWITCH & WELCOME HERO */}
      <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-[32px] p-6 md:p-10 text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-teal-600/5 rounded-full blur-2xl pointer-events-none" />

        {/* Top bar within hero card */}
        <div className="flex justify-between items-center mb-6 md:mb-10 relative z-10">
          <span className="bg-teal-500/15 text-teal-400 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-teal-500/20 flex items-center gap-1.5 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 fill-teal-400" />
            Hackathon Prototype - Kerala Region
          </span>
          
          {/* Custom Lang Switch */}
          <button
            onClick={onLanguageToggle}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-teal-400 text-xs font-bold px-3 py-2 rounded-xl border border-slate-700 transition-all cursor-pointer"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{activeLanguage === 'EN' ? 'Malayalam (മലയാളം)' : 'English'}</span>
          </button>
        </div>

        {/* Hero details */}
        <div className="max-w-3xl space-y-4 md:space-y-6 relative z-10">
          <span className="text-teal-400 text-xs md:text-sm font-bold uppercase tracking-wider">{text.welcome}</span>
          <h1 className="text-2xl md:text-5xl font-black tracking-tight leading-none text-white font-sans max-w-2xl">
            {text.tagline}
          </h1>
          <p className="text-slate-400 text-xs md:text-base leading-relaxed max-w-2xl font-medium">
            {text.subtitle}
          </p>

          {/* Quick Search form */}
          <form onSubmit={handleGlobalSearch} className="flex flex-col sm:flex-row items-center gap-2.5 max-w-xl pt-2">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={text.searchPlaceholder}
                className="w-full pl-10 pr-4 py-3 bg-slate-900/90 rounded-xl border border-slate-800 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-3 bg-teal-500 hover:bg-teal-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shrink-0"
            >
              Search
            </button>
          </form>

          {/* CTA Row */}
          <div className="flex flex-wrap items-center gap-3 pt-4">
            <button
              onClick={() => onNavigateToTab('wizard')}
              className="px-5 py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Compass className="w-4 h-4 text-teal-600 animate-spin" style={{ animationDuration: '4s' }} />
              {text.exploreBtn}
            </button>

            <button
              onClick={() => alert("CareerCompass demo video will launch soon! Follow our 'Start Here' tab for step-by-step guidance.")}
              className="px-5 py-3 bg-slate-800/80 hover:bg-slate-700/80 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 border border-slate-700 cursor-pointer"
            >
              <Play className="w-4.5 h-4.5 text-teal-400 fill-teal-400" />
              {text.watchDemo}
            </button>
          </div>
        </div>
      </div>

      {/* QUICK STATUS TICKER */}
      {profile.name && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎓</span>
            <div>
              <span className="text-slate-400 font-bold uppercase tracking-widest text-[9px] block">Student Desk</span>
              <span className="font-extrabold text-slate-800">{profile.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {profile.district && (
              <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-semibold">{text.activeDistrict}:</span>{' '}
                <span className="font-extrabold text-slate-700">{profile.district}</span>
              </div>
            )}
            {profile.currentClass && (
              <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-semibold">{text.grade}:</span>{' '}
                <span className="font-extrabold text-slate-700">{profile.currentClass}</span>
              </div>
            )}
            {recommendedStream && (
              <div className="bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-100 text-teal-700">
                <span className="font-semibold">Aptitude Rec:</span>{' '}
                <span className="font-extrabold">{recommendedStream}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* "MY JOURNEY" TIMELINE PROGRESS TRACKER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Journey Progress circular card */}
        <div className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-teal-600 animate-pulse" />
              {text.journeyTitle}
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{text.journeySubtitle}</p>
          </div>

          <div className="py-6 flex flex-col items-center justify-center space-y-4">
            {/* Radial / Circle Progress */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  className="stroke-slate-100"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  className="stroke-teal-500 transition-all duration-1000"
                  strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - progressPercent / 100)}`}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-900">{progressPercent}%</span>
                <span className="text-[9px] font-black text-teal-600 uppercase tracking-widest">{completedCount} / {journeySteps.length} DONE</span>
              </div>
            </div>

            <p className="text-center text-[11px] text-slate-500 font-medium max-w-[200px] leading-relaxed">
              {progressPercent === 100 
                ? "Excellent! You have fully explored the digital CareerCompass tools!" 
                : "Complete tasks below to chart your course and print your counselor report."}
            </p>
          </div>

          <button
            onClick={() => {
              const unfinished = journeySteps.find(s => !s.checked);
              if (unfinished) onNavigateToTab(unfinished.tab);
              else onNavigateToTab('wizard');
            }}
            className="w-full py-2.5 bg-slate-950 hover:bg-slate-850 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer text-center"
          >
            {progressPercent === 100 ? "Review Wizard Predictions" : "Resume My Journey"}
          </button>
        </div>

        {/* Interactive Checklist list */}
        <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm space-y-4 overflow-y-auto max-h-[360px] scrollbar-thin">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Core Milestones Tracker</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {journeySteps.map((step, idx) => (
              <div 
                key={step.id} 
                onClick={() => onNavigateToTab(step.tab)}
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer select-none group ${
                  step.checked 
                    ? 'bg-teal-50/15 border-teal-100 text-slate-700' 
                    : 'bg-slate-50/50 border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {step.checked ? (
                    <CheckCircle className="w-4 h-4 text-teal-600 fill-teal-100" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300 group-hover:border-teal-500" />
                  )}
                </div>
                <div className="min-w-0 space-y-0.5">
                  <span className={`text-xs block font-bold transition-all ${
                    step.checked ? 'text-slate-800 line-through opacity-80' : 'text-slate-800'
                  }`}>
                    {idx + 1}. {step.label}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold block leading-tight">{step.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* QUICK ACCESS CARDS */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">{text.notSure}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigateToTab('wizard')}
            className="bg-teal-500 hover:bg-teal-600 text-slate-950 p-5 rounded-2xl text-left border border-teal-400 shadow-sm transition-all cursor-pointer flex flex-col justify-between space-y-4 group h-36"
          >
            <Compass className="w-5 h-5" />
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest block opacity-80">Phase 1</span>
              <span className="text-xs font-black block group-hover:underline">Start Here Wizard</span>
            </div>
          </button>

          <button
            onClick={() => onNavigateToTab('chat')}
            className="bg-white hover:bg-slate-50 p-5 rounded-2xl text-left border border-slate-100 shadow-sm transition-all cursor-pointer flex flex-col justify-between space-y-4 group h-36"
          >
            <BrainCircuit className="w-5 h-5 text-teal-600" />
            <div>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block">Phase 2</span>
              <span className="text-xs font-bold text-slate-800 block group-hover:underline">Ask Compass AI</span>
            </div>
          </button>

          <button
            onClick={() => onNavigateToTab('scholarships')}
            className="bg-white hover:bg-slate-50 p-5 rounded-2xl text-left border border-slate-100 shadow-sm transition-all cursor-pointer flex flex-col justify-between space-y-4 group h-36"
          >
            <Award className="w-5 h-5 text-teal-600" />
            <div>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block">Phase 3</span>
              <span className="text-xs font-bold text-slate-800 block group-hover:underline">Scholarships Hub</span>
            </div>
          </button>

          <button
            onClick={() => onNavigateToTab('learning')}
            className="bg-white hover:bg-slate-50 p-5 rounded-2xl text-left border border-slate-100 shadow-sm transition-all cursor-pointer flex flex-col justify-between space-y-4 group h-36"
          >
            <BookOpen className="w-5 h-5 text-teal-600" />
            <div>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block">Phase 4</span>
              <span className="text-xs font-bold text-slate-800 block group-hover:underline">Learning Materials</span>
            </div>
          </button>
        </div>
      </div>

      {/* WHY CAREERCOMPASS BENTO GRID */}
      <div className="bg-white rounded-[32px] border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-lg font-black text-slate-900">{text.whyTitle}</h3>
          <p className="text-xs text-slate-450 font-semibold">{text.whySubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          
          {/* Bento 1: Problem */}
          <div className="bg-rose-50/20 p-5 rounded-2xl border border-rose-500/5 space-y-3">
            <span className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 font-bold text-xs">⚠️</span>
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">{text.probTitle}</h4>
            <p className="text-[11px] text-slate-550 font-medium leading-relaxed">
              {text.probDesc}
            </p>
          </div>

          {/* Bento 2: Solution */}
          <div className="bg-teal-50/20 p-5 rounded-2xl border border-teal-500/5 space-y-3">
            <span className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 font-bold text-xs">💡</span>
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">{text.solTitle}</h4>
            <p className="text-[11px] text-slate-550 font-medium leading-relaxed">
              {text.solDesc}
            </p>
          </div>

          {/* Bento 3: Statistics */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Verified State Statistics</h4>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-xs">
                <span className="text-lg font-black text-teal-600 block leading-none">14</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">Districts mapped</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-xs">
                <span className="text-lg font-black text-teal-600 block leading-none">200+</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">Govt colleges</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-xs">
                <span className="text-lg font-black text-teal-600 block leading-none">35+</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">Core Modules</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-xs">
                <span className="text-lg font-black text-teal-600 block leading-none">100%</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">Free Access</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* STUDENT SUCCESS STORIES DECK */}
      <div className="bg-white rounded-[32px] border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900">{text.successTitle}</h3>
            <p className="text-xs text-slate-400 font-semibold">Real journeys of state-board students from across Kerala</p>
          </div>
          <div className="flex gap-1.5">
            {successStories.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStoryIdx(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  activeStoryIdx === idx ? 'bg-teal-500 w-5' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-6 flex flex-col md:flex-row items-center gap-6">
          <img
            src={successStories[activeStoryIdx].img}
            alt={successStories[activeStoryIdx].name}
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="space-y-3 flex-1">
            <span className="text-[10px] font-black text-teal-650 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100 uppercase tracking-wider inline-block">
              {successStories[activeStoryIdx].tag}
            </span>
            <p className="text-xs md:text-sm text-slate-600 italic font-medium leading-relaxed">
              "{successStories[activeStoryIdx].quote}"
            </p>
            <div className="flex items-center gap-2 pt-1">
              <div>
                <h5 className="text-xs font-black text-slate-900">{successStories[activeStoryIdx].name}</h5>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  {successStories[activeStoryIdx].district} • {successStories[activeStoryIdx].college}
                </p>
                <p className="text-[10px] text-teal-600 font-black uppercase tracking-widest mt-0.5">
                  {successStories[activeStoryIdx].career}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
