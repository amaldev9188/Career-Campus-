import React, { useState, useEffect } from 'react';
import { StreamType, DegreeOption } from '../types';
import { careerData } from '../data/careers';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FlaskConical, 
  BookOpen, 
  Briefcase, 
  Wrench, 
  ArrowRight, 
  GraduationCap, 
  FileText, 
  Building, 
  MapPin, 
  Clock, 
  Compass, 
  CheckCircle2,
  GitFork,
  LucideIcon
} from 'lucide-react';

interface CareerMapSectionProps {
  recommendedStream: StreamType | null;
}

const STREAM_ICONS: Record<StreamType, LucideIcon> = {
  Science: FlaskConical,
  Arts: BookOpen,
  Commerce: Briefcase,
  Vocational: Wrench
};

const STREAM_COLOR_THEMES: Record<StreamType, {
  activeBg: string;
  activeBorder: string;
  textColor: string;
  pillColor: string;
}> = {
  Science: {
    activeBg: 'bg-gradient-to-br from-teal-600 to-teal-700 text-white shadow-lg shadow-teal-600/15',
    activeBorder: 'border-teal-600',
    textColor: 'text-teal-600',
    pillColor: 'bg-teal-50 text-teal-700'
  },
  Arts: {
    activeBg: 'bg-gradient-to-br from-rose-600 to-rose-700 text-white shadow-lg shadow-rose-600/15',
    activeBorder: 'border-rose-600',
    textColor: 'text-rose-600',
    pillColor: 'bg-rose-50 text-rose-700'
  },
  Commerce: {
    activeBg: 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-600/15',
    activeBorder: 'border-emerald-600',
    textColor: 'text-emerald-600',
    pillColor: 'bg-emerald-50 text-emerald-700'
  },
  Vocational: {
    activeBg: 'bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-600/15',
    activeBorder: 'border-amber-600',
    textColor: 'text-amber-600',
    pillColor: 'bg-amber-50 text-amber-700'
  }
};

export default function CareerMapSection({ recommendedStream }: CareerMapSectionProps) {
  const [activeStream, setActiveStream] = useState<StreamType>('Science');
  const [selectedDegree, setSelectedDegree] = useState<DegreeOption | null>(null);

  // If student completed the quiz and got a recommendation, auto-focus on that stream
  useEffect(() => {
    if (recommendedStream) {
      setActiveStream(recommendedStream);
    }
  }, [recommendedStream]);

  // Reset selected degree when active stream changes
  const handleStreamChange = (stream: StreamType) => {
    setActiveStream(stream);
    const data = careerData.find(d => d.stream === stream);
    if (data && data.degrees.length > 0) {
      setSelectedDegree(data.degrees[0]);
    } else {
      setSelectedDegree(null);
    }
  };

  // Set default selected degree on load
  useEffect(() => {
    const data = careerData.find(d => d.stream === activeStream);
    if (data && data.degrees.length > 0 && !selectedDegree) {
      setSelectedDegree(data.degrees[0]);
    }
  }, [activeStream, selectedDegree]);

  const activeStreamData = careerData.find(d => d.stream === activeStream);
  const theme = STREAM_COLOR_THEMES[activeStream];

  return (
    <div id="career-map-container" className="space-y-8">
      
      {/* Stream Selection Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(['Science', 'Arts', 'Commerce', 'Vocational'] as StreamType[]).map((stream) => {
          const Icon = STREAM_ICONS[stream];
          const isSelected = activeStream === stream;
          const isRecommended = recommendedStream === stream;
          const currentTheme = STREAM_COLOR_THEMES[stream];
          
          return (
            <button
              key={stream}
              onClick={() => handleStreamChange(stream)}
              className={`flex flex-col items-center justify-center p-5 rounded-[24px] border text-center relative transition-all cursor-pointer ${
                isSelected 
                  ? currentTheme.activeBg + ' ' + currentTheme.activeBorder
                  : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-600 hover:border-slate-300'
              }`}
            >
              {isRecommended && (
                <span className="absolute -top-2.5 right-2.5 bg-yellow-400 text-[9px] text-slate-950 font-black px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wider animate-pulse">
                  Recommended
                </span>
              )}
              <Icon className="w-6 h-6 mb-2" />
              <span className="text-sm font-extrabold block">{stream}</span>
              <span className="text-[10px] opacity-85 font-bold mt-1 uppercase tracking-wider">
                {stream === 'Science' ? 'Group I / II' : 
                 stream === 'Arts' ? 'Humanities' : 
                 stream === 'Commerce' ? 'Finance & Mgmt' : 'Job-Oriented'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Stream Description & Core Suitability */}
      {activeStreamData && (
        <motion.div
          key={`intro-${activeStream}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2">
            <Compass className={`w-5 h-5 ${theme.textColor}`} />
            <h3 className="text-xl serif-italic font-normal text-slate-950">About {activeStreamData.title}</h3>
          </div>
          <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-medium">{activeStreamData.description}</p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-2.5 text-xs text-slate-600">
            <span className="font-bold text-teal-600 shrink-0 uppercase tracking-wider text-[10px] pt-0.5">Ideal For:</span>
            <span className="font-medium">{activeStreamData.suitableFor}</span>
          </div>
        </motion.div>
      )}

      {/* Degree Selection Grid */}
      {activeStreamData && (
        <div className="space-y-3">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Select a Degree / Diploma Pathway</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {activeStreamData.degrees.map((degree) => {
              const isSelected = selectedDegree?.id === degree.id;
              return (
                <button
                  key={degree.id}
                  onClick={() => setSelectedDegree(degree)}
                  className={`p-5 rounded-[24px] border text-left flex flex-col justify-between h-36 transition-all cursor-pointer ${
                    isSelected
                      ? `bg-slate-50 border-2 ${theme.activeBorder} ring-4 ring-teal-500/10`
                      : 'bg-white border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <h4 className="text-sm font-extrabold text-slate-900 line-clamp-2 leading-snug">{degree.name}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-normal font-semibold">{degree.description}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {degree.duration}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Visual Career Flowchart */}
      <AnimatePresence mode="wait">
        {selectedDegree && (
          <motion.div
            key={selectedDegree.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-6 pt-2"
          >
            {/* Visual Header / Node Entry */}
            <div className="bg-slate-950 rounded-[32px] p-8 text-white text-center shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 -z-10 hidden md:block" />
              
              <div className="relative z-10 flex flex-col items-center max-w-xl mx-auto space-y-3">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider text-teal-400 border border-white/5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Target Pathway Selected
                </div>
                <h3 className="text-2xl md:text-3xl serif-italic font-normal text-white">{selectedDegree.name}</h3>
                <p className="text-xs text-slate-300 max-w-md font-medium leading-relaxed">{selectedDegree.description}</p>
                
                <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-teal-400 font-bold bg-teal-950/40 px-3 py-1 rounded-full border border-teal-500/20">
                  <Clock className="w-3.5 h-3.5 animate-pulse" />
                  Duration: {selectedDegree.duration}
                </div>
              </div>
            </div>

            {/* Downward connecting branch indicator (visible on desktop) */}
            <div className="hidden md:flex flex-col items-center justify-center -my-6 relative z-20">
              <div className="w-1 h-8 bg-teal-500" />
              <div className="bg-teal-500 text-white rounded-full p-2 shadow-lg">
                <GitFork className="w-4 h-4" />
              </div>
              <div className="w-1 h-8 bg-teal-500" />
            </div>

            {/* Three-Column Career Map Flow */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              
              {/* Branch 1: Government Sector / Public Service */}
              <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                <div className="bg-gradient-to-r from-slate-900 to-slate-950 px-5 py-4 text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-teal-400 shrink-0" />
                  <div>
                    <h4 className="text-sm font-extrabold text-white">Government Sector</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Exams, PSCs & Public Units</p>
                  </div>
                </div>
                
                <div className="p-5 flex-1 space-y-3.5">
                  <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                    Kerala state and central public service commission channels that hire candidates holding this degree:
                  </p>
                  
                  <div className="space-y-2.5">
                    {selectedDegree.govExams.map((exam, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={idx} 
                        className="p-3 bg-teal-50/30 border border-teal-100/50 rounded-xl hover:bg-teal-50/60 hover:border-teal-200 transition-all flex gap-2.5 items-start"
                      >
                        <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="text-xs font-bold text-slate-800 leading-normal">
                          {exam}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Branch 2: Private Sector / Industry Careers */}
              <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                <div className="bg-gradient-to-r from-slate-900 to-slate-950 px-5 py-4 text-white flex items-center gap-2">
                  <Building className="w-5 h-5 text-teal-400 shrink-0" />
                  <div>
                    <h4 className="text-sm font-extrabold text-white">Private & Corporate Roles</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Direct Industry Employment</p>
                  </div>
                </div>
                
                <div className="p-5 flex-1 space-y-3.5">
                  <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                    Most popular industrial applications, startups, and professional roles requiring this specialization:
                  </p>
                  
                  <div className="space-y-2.5">
                    {selectedDegree.privateRoles.map((role, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={idx} 
                        className="p-3 bg-emerald-50/30 border border-emerald-100/50 rounded-xl hover:bg-emerald-50/60 hover:border-emerald-200 transition-all flex gap-2.5 items-start"
                      >
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="text-xs font-bold text-slate-800 leading-normal">
                          {role}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Branch 3: Higher Studies / Professional Specialization */}
              <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                <div className="bg-gradient-to-r from-slate-900 to-slate-950 px-5 py-4 text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-teal-400 shrink-0" />
                  <div>
                    <h4 className="text-sm font-extrabold text-white">Higher Studies & Specialization</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Specializations & Doctorates</p>
                  </div>
                </div>
                
                <div className="p-5 flex-1 space-y-3.5">
                  <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                    Further education options, specialized certifications, and postgraduate paths to increase expertise:
                  </p>
                  
                  <div className="space-y-2.5">
                    {selectedDegree.higherStudies.map((study, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={idx} 
                        className="p-3 bg-amber-50/30 border border-amber-100/50 rounded-xl hover:bg-amber-50/60 hover:border-amber-200 transition-all flex gap-2.5 items-start"
                      >
                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="text-xs font-bold text-slate-800 leading-normal">
                          {study}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Key takeaway advice for this path */}
            <div className="bg-teal-50/30 border border-teal-100/60 rounded-[24px] p-5 flex items-start gap-3.5">
              <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h5 className="text-xs font-extrabold text-slate-950 uppercase tracking-wider">Advice for Aspiring {selectedDegree.name} Students</h5>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  Start mapping your optional papers early. If you wish to target the private sector, compile practical project portfolios. For government sector careers, consider registering with the Kerala PSC One-Time Registration portal immediately after passing your qualifying exam.
                </p>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
