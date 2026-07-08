import { useState, useEffect, useMemo } from 'react';
import { College } from '../types';
import { collegesData, districtsList } from '../data/colleges';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  School, 
  BookOpen, 
  Filter, 
  X, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function CollegeDirectorySection() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const colRef = collection(db, 'colleges');
        const snapshot = await getDocs(colRef);
        if (!snapshot.empty) {
          const list: College[] = [];
          snapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() } as College);
          });
          setColleges(list);
        } else {
          setColleges(collegesData);
        }
      } catch (err) {
        console.error('Error fetching colleges from Firestore:', err);
        setColleges(collegesData);
      } finally {
        setLoading(false);
      }
    };
    fetchColleges();
  }, []);

  const collegeTypes = useMemo(() => {
    const typesSet = new Set(colleges.map(c => c.type));
    return Array.from(typesSet);
  }, [colleges]);

  const filteredColleges = useMemo(() => {
    return colleges.filter((clg) => {
      const matchesSearch = 
        clg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clg.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clg.popularCourses.some(course => course.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesDistrict = selectedDistrict ? clg.district === selectedDistrict : true;
      const matchesType = selectedType ? clg.type === selectedType : true;

      return matchesSearch && matchesDistrict && matchesType;
    });
  }, [colleges, searchQuery, selectedDistrict, selectedType]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedDistrict('');
    setSelectedType('');
  };

  const getTypeBadgeStyles = (type: College['type']) => {
    switch (type) {
      case 'Engineering':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Medical':
        return 'bg-red-50 text-red-700 border-red-100';
      case 'Polytechnic':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Arts & Science':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'Technical/Vocational':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-teal-500 rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Syncing Kerala Institution Database...</p>
      </div>
    );
  }

  return (
    <div id="directory-container" className="space-y-6">
      
      {/* Directory Introduction Banner */}
      <div className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-teal-600 uppercase tracking-wider">
            <School className="w-3.5 h-3.5 animate-pulse" />
            Verified Database
          </div>
          <h2 className="text-3xl md:text-5xl serif-italic font-normal text-slate-950">Government College Directory</h2>
          <p className="text-xs md:text-sm text-slate-500 font-medium max-w-xl">
            Search and filter authorized government institutions, polytechnics, vocational centers, and colleges in Kerala.
          </p>
        </div>
        
        <div className="bg-teal-50 px-5 py-3 rounded-2xl border border-teal-100 shrink-0">
          <span className="text-[10px] text-teal-700 font-black uppercase tracking-wider block">Available List</span>
          <span className="text-xl font-black text-teal-800">{colleges.length} Institutions</span>
        </div>
      </div>

      {/* Search & Filters Controls Panel */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
        
        {/* Row 1: Text Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by college name, address, or courses (e.g. Computer Science)..."
            className="w-full pl-11 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all text-slate-700 placeholder:text-slate-400 text-sm font-semibold"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Row 2: Select Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          
          {/* District Filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">District</label>
            <div className="relative">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all text-xs font-semibold text-slate-700"
              >
                <option value="">All Districts ({districtsList.length})</option>
                {districtsList.map((dist) => {
                  const count = colleges.filter(c => c.district === dist).length;
                  return (
                    <option key={dist} value={dist} disabled={count === 0}>
                      {dist} {count > 0 ? `(${count})` : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Type Filter */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Institution Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all text-xs font-semibold text-slate-700"
            >
              <option value="">All Types ({collegeTypes.length})</option>
              {collegeTypes.map((t) => {
                const count = colleges.filter(c => c.type === t).length;
                return (
                  <option key={t} value={t}>
                    {t} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Clean Filters Button / Active Indicators */}
          <div className="flex items-end">
            {(selectedDistrict || selectedType || searchQuery) ? (
              <button
                onClick={handleClearFilters}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg font-bold text-xs uppercase tracking-wider transition-all border border-rose-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
                Clear Active Filters
              </button>
            ) : (
              <div className="w-full py-3 px-4 text-[11px] text-slate-400 text-center font-bold bg-slate-50 border border-dashed border-slate-200 rounded-lg flex items-center justify-center gap-1.5 uppercase tracking-wider">
                <Filter className="w-3.5 h-3.5 animate-pulse" />
                Filters inactive
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Filter Status Text */}
      <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between px-2">
        <span>
          Showing <b className="text-slate-700">{filteredColleges.length}</b> of <b className="text-slate-700">{colleges.length}</b> institutions
        </span>
        {(selectedDistrict || selectedType || searchQuery) && (
          <span className="text-teal-600 animate-pulse">Filters are Active</span>
        )}
      </div>

      {/* College Directory Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <AnimatePresence mode="popLayout">
          {filteredColleges.map((clg, index) => {
            const badgeStyle = getTypeBadgeStyles(clg.type);
            
            return (
              <motion.div
                key={clg.id}
                layoutId={`clg-card-${clg.id}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.3) }}
                className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm hover:shadow-md hover:border-slate-200 transition-all flex flex-col justify-between space-y-4"
              >
                {/* Header Information */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border shrink-0 ${badgeStyle}`}>
                      {clg.type}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      {clg.district}
                    </span>
                  </div>
                  
                  <h3 className="text-base font-extrabold text-slate-900 leading-snug line-clamp-2">
                    {clg.name}
                  </h3>
                  
                  <p className="text-[11px] text-slate-500 line-clamp-2 font-medium">
                    {clg.address}
                  </p>
                </div>

                {/* Popular Course Chips */}
                {clg.popularCourses && clg.popularCourses.length > 0 && (
                  <div className="border-t border-b border-slate-100 py-3 space-y-2">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-slate-400" />
                      Popular Courses Offered
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {clg.popularCourses.map((course, cIdx) => (
                        <span key={cIdx} className="bg-slate-50 text-[10px] font-bold text-slate-600 px-2 py-1 rounded-md border border-slate-100">
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contacts / Action Row */}
                <div className="grid grid-cols-3 gap-2.5 pt-1 text-center">
                  
                  {/* Phone action */}
                  <a
                    href={`tel:${clg.contactPhone}`}
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50/50 hover:bg-slate-50 border border-slate-100 transition-all group cursor-pointer"
                  >
                    <Phone className="w-4 h-4 text-teal-600 mb-1 group-hover:scale-110 transition-all" />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Call Now</span>
                  </a>

                  {/* Email action */}
                  <a
                    href={`mailto:${clg.contactEmail}`}
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50/50 hover:bg-slate-50 border border-slate-100 transition-all group cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-emerald-600 mb-1 group-hover:scale-110 transition-all" />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Email Desk</span>
                  </a>

                  {/* Web action */}
                  <a
                    href={clg.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50/50 hover:bg-slate-50 border border-slate-100 transition-all group cursor-pointer"
                  >
                    <Globe className="w-4 h-4 text-indigo-600 mb-1 group-hover:scale-110 transition-all" />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-0.5 justify-center">
                      Website
                      <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                    </span>
                  </a>

                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredColleges.length === 0 && (
          <div className="col-span-full bg-white rounded-[32px] border border-slate-100 p-12 text-center space-y-4">
            <School className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-xl serif-italic font-normal text-slate-900">No Colleges Match Your Filters</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium leading-relaxed">
              We couldn't find any institutions in our current list matching "{searchQuery}" or the active filters. Try clearing your search parameters!
            </p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-md shadow-teal-600/10 transition-all cursor-pointer"
            >
              Reset Search & Filters
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
