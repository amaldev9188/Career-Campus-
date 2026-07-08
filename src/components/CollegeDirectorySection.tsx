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
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function CollegeDirectorySection() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(''); // '', 'Government', 'Private'

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
      
      const categoryVal = clg.category || 'Government';
      const matchesCategory = selectedCategory ? categoryVal === selectedCategory : true;

      return matchesSearch && matchesDistrict && matchesType && matchesCategory;
    });
  }, [colleges, searchQuery, selectedDistrict, selectedType, selectedCategory]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedDistrict('');
    setSelectedType('');
    setSelectedCategory('');
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
            Kerala Campus Directory
          </div>
          <h2 className="text-3xl md:text-5xl serif-italic font-normal text-slate-950">
            {selectedCategory === 'Government' 
              ? 'Government Institution Hub' 
              : selectedCategory === 'Private' 
                ? 'Private Sector Colleges' 
                : 'Kerala Higher Education Directory'}
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-medium max-w-xl">
            {selectedCategory === 'Government' 
              ? 'Search and filter authorized government institutions, polytechnics, vocational centers, and colleges in Kerala.'
              : selectedCategory === 'Private'
                ? 'Discover elite accredited private colleges, self-financing institutions, and technology campuses in Kerala.'
                : 'Browse verified profiles of both public/government and top-rated private sector colleges in Kerala.'}
          </p>
        </div>
        
        <div className="bg-teal-50 px-5 py-3 rounded-2xl border border-teal-100 shrink-0">
          <span className="text-[10px] text-teal-700 font-black uppercase tracking-wider block">Available List</span>
          <span className="text-xl font-black text-teal-800">{colleges.length} Institutions</span>
        </div>
      </div>

      {/* Segmented Category Sector Filter */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl max-w-lg w-full border border-slate-200/50">
        <button
          onClick={() => setSelectedCategory('')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedCategory === ''
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
          }`}
        >
          All Sectors ({colleges.length})
        </button>
        <button
          onClick={() => setSelectedCategory('Government')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            selectedCategory === 'Government'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
          Government ({colleges.filter(c => (c.category || 'Government') === 'Government').length})
        </button>
        <button
          onClick={() => setSelectedCategory('Private')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            selectedCategory === 'Private'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Private Sector ({colleges.filter(c => c.category === 'Private').length})
        </button>
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
                  const count = colleges.filter(c => c.district === dist && (selectedCategory ? (c.category || 'Government') === selectedCategory : true)).length;
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
              <option value="">All Types</option>
              {collegeTypes.map((t) => {
                const count = colleges.filter(c => c.type === t && (selectedCategory ? (c.category || 'Government') === selectedCategory : true)).length;
                return (
                  <option key={t} value={t} disabled={count === 0}>
                    {t} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Clean Filters Button / Active Indicators */}
          <div className="flex items-end">
            {(selectedDistrict || selectedType || searchQuery || selectedCategory) ? (
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
        {(selectedDistrict || selectedType || searchQuery || selectedCategory) && (
          <span className="text-teal-600 animate-pulse">Filters are Active</span>
        )}
      </div>

      {/* College Directory Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredColleges.map((clg, index) => {
            const isPrivate = clg.category === 'Private';
            
            return (
              <motion.div
                key={clg.id}
                layoutId={`clg-card-${clg.id}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.3) }}
                className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm hover:shadow-md hover:border-slate-200/80 transition-all flex flex-col justify-between space-y-4 group overflow-hidden"
              >
                {/* College Image Header */}
                <div className="relative h-48 -mx-6 -mt-6 overflow-hidden rounded-t-[32px] bg-slate-100">
                  <img 
                    src={clg.imageUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=60'} 
                    alt={clg.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent pointer-events-none" />
                  
                  {/* Category & Type badges overlaid on image */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm text-white ${
                      isPrivate 
                        ? 'bg-amber-500 border border-amber-400' 
                        : 'bg-teal-600 border border-teal-500'
                    }`}>
                      {clg.category || 'Government'}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm bg-slate-900/80 backdrop-blur-md text-white border border-slate-800">
                      {clg.type}
                    </span>
                  </div>

                  {/* District badge overlaid on bottom left of image */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-white text-xs font-bold drop-shadow-sm">
                    <MapPin className="w-3.5 h-3.5 text-teal-400" />
                    {clg.district}
                  </div>
                </div>

                {/* Header Information */}
                <div className="space-y-2 flex-1">
                  <h3 className="text-base font-extrabold text-slate-900 leading-snug line-clamp-2 group-hover:text-teal-600 transition-colors">
                    {clg.name}
                  </h3>
                  
                  <p className="text-[11px] text-slate-500 line-clamp-2 font-medium">
                    {clg.address}
                  </p>
                </div>

                {/* Popular Course Chips */}
                {clg.popularCourses && clg.popularCourses.length > 0 && (
                  <div className="border-t border-b border-slate-100 py-3.5 space-y-2">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
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
