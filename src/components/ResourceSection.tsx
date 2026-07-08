import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AdmissionDeadline, EduResource } from '../types';
import { baselineDeadlines } from '../data/resources';
import { eduResources } from '../data/resources';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  BookOpen, 
  ExternalLink, 
  Check, 
  X, 
  Sparkles, 
  Layers, 
  GraduationCap, 
  Clock, 
  Info,
  Undo
} from 'lucide-react';

export default function ResourceSection() {
  const [deadlines, setDeadlines] = useState<AdmissionDeadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<'All' | 'Class 10' | 'Class 12' | 'Scholarships'>('All');

  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        const colRef = collection(db, 'deadlines');
        const snapshot = await getDocs(colRef);
        if (!snapshot.empty) {
          const list: AdmissionDeadline[] = [];
          snapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() } as AdmissionDeadline);
          });
          setDeadlines(list);
        } else {
          setDeadlines(baselineDeadlines);
        }
      } catch (err) {
        console.error('Error fetching deadlines from Firestore:', err);
        setDeadlines(baselineDeadlines);
      } finally {
        setLoading(false);
      }
    };
    fetchDeadlines();
  }, []);

  const filteredDeadlines = deadlines.filter((dl) => {
    if (filterCategory === 'All') return true;
    return dl.category === filterCategory || dl.category === 'All';
  });

  const getStatusBadgeStyle = (status: AdmissionDeadline['status']) => {
    switch (status) {
      case 'Open':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Upcoming':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Closed':
        return 'bg-slate-100 text-slate-500 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-IN', options);
    } catch {
      return dateString;
    }
  };

  const isExpired = (dateString: string) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const deadlineDate = new Date(dateString);
      return deadlineDate < today;
    } catch {
      return false;
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-teal-500 rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Syncing Admission Timelines...</p>
      </div>
    );
  }

  return (
    <div id="resources-container" className="space-y-10">
      
      {/* Admission Deadlines Grid Section */}
      <div className="space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-teal-600 uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              Interactive Timeline
            </div>
            <h2 className="text-3xl md:text-5xl serif-italic font-normal text-slate-950">Kerala Admission Deadlines</h2>
            <p className="text-xs md:text-sm text-slate-500 font-medium max-w-xl leading-relaxed">
              Keep track of key entrance portals, allotment registrations, and closing deadline dates.
            </p>
          </div>
        </div>

        {/* Level Filters tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-fit max-w-full overflow-x-auto">
          {(['All', 'Class 10', 'Class 12', 'Scholarships'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterCategory === cat
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {cat === 'All' ? 'All Deadlines' : cat}
            </button>
          ))}
        </div>

        {/* Timelines Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredDeadlines.map((dl) => {
              const expired = isExpired(dl.date);
              
              return (
                <motion.div
                  key={dl.id}
                  layoutId={`dl-card-${dl.id}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  {/* Display Mode */}
                  <div className="flex-1 flex flex-col justify-between space-y-4">
                    
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex gap-2 items-center">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadgeStyle(dl.status)}`}>
                            {dl.status}
                          </span>
                          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">
                            {dl.category}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-base font-extrabold text-slate-900 leading-snug line-clamp-2">
                          {dl.title}
                        </h3>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                          Admissions Board: {dl.portal}
                        </span>
                      </div>
                    </div>

                    {/* Date & Link Row */}
                    <div className="border-t border-slate-50 pt-3 flex items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-slate-400" />
                          Closing Date
                        </span>
                        <span className={`text-xs font-black ${expired ? 'text-rose-600 line-through' : 'text-slate-700'}`}>
                          {formatDate(dl.date)}
                        </span>
                        {expired && dl.status !== 'Closed' && (
                          <span className="text-[9px] font-bold text-rose-500 block">Date is in the past!</span>
                        )}
                      </div>

                      <a
                        href={dl.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold rounded-xl text-xs transition-all group shrink-0 cursor-pointer"
                      >
                        Visit Portal
                        <ExternalLink className="w-3 h-3 text-teal-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </a>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>

      {/* Open Educational Resources Section */}
      <div className="space-y-6">
        
        {/* Section Header */}
        <div className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-teal-600 uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              Resource Repository
            </div>
            <h2 className="text-3xl md:text-5xl serif-italic font-normal text-slate-950">Open Educational Resources</h2>
            <p className="text-xs md:text-sm text-slate-500 font-medium max-w-xl">
              Unlock prestigious, fully-free textbooks, online university lectures, structured curriculum guides, and test prep materials.
            </p>
          </div>
          
          <div className="bg-teal-50 text-teal-800 text-[10px] uppercase tracking-wider px-4 py-2 rounded-full font-bold border border-teal-100 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-pulse fill-teal-600" />
            100% Free Resources
          </div>
        </div>

        {/* Resources Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {eduResources.map((res) => (
            <div
              key={res.id}
              className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm hover:shadow-md hover:border-slate-200 transition-all flex flex-col justify-between h-60"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block bg-slate-50 px-2 py-0.5 rounded">
                    {res.category}
                  </span>
                  {res.isFree && (
                    <span className="text-[9px] font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                      FREE
                    </span>
                  )}
                </div>
                
                <h3 className="text-sm font-extrabold text-slate-900 line-clamp-1 leading-snug">
                  {res.title}
                </h3>
                
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed font-semibold">
                  {res.description}
                </p>
              </div>

              {/* Action Row */}
              <div className="border-t border-slate-50 pt-3 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  By: {res.provider}
                </span>
                
                <a
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-600 hover:text-teal-800 transition-all group cursor-pointer"
                >
                  Access Platform
                  <ExternalLink className="w-3 h-3 text-teal-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
