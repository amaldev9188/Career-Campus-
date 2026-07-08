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
  Sparkles,
  Heart,
  Map,
  Compass,
  Navigation,
  Info,
  Layers,
  ChevronRight,
  List,
  AlertCircle
} from 'lucide-react';

export default function CollegeDirectorySection() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(''); // '', 'Government', 'Private'
  const [savedColleges, setSavedColleges] = useState<string[]>([]);

  // Map Feature States
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedCollegeForMap, setSelectedCollegeForMap] = useState<College | null>(null);
  const [activeModalCollege, setActiveModalCollege] = useState<College | null>(null);

  useEffect(() => {
    // Read bookmarks
    const cached = localStorage.getItem('career_compass_saved_colleges');
    if (cached) {
      try {
        setSavedColleges(JSON.parse(cached));
      } catch {}
    }

    // Read global search query passed from the home dashboard
    const globalQuery = localStorage.getItem('career_compass_global_query');
    if (globalQuery) {
      setSearchQuery(globalQuery);
      localStorage.removeItem('career_compass_global_query');
    }

    const fetchColleges = async () => {
      try {
        const colRef = collection(db, 'colleges');
        const snapshot = await getDocs(colRef);
        if (!snapshot.empty) {
          const list: College[] = [];
          snapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() } as College);
          });
          
          // Merge with collegesData to ensure any new hardcoded colleges in colleges.ts
          // are still displayed and fully loaded
          const firestoreIds = new Set(list.map(c => c.id));
          const missingColleges = collegesData.filter(c => !firestoreIds.has(c.id));
          
          if (missingColleges.length > 0) {
            setColleges([...list, ...missingColleges]);
          } else {
            setColleges(list);
          }
        } else {
          setColleges(collegesData);
        }
      } catch (err) {
        console.error('Error fetching colleges from Firestore, falling back to local static data:', err);
        setColleges(collegesData);
      } finally {
        setLoading(false);
      }
    };
    fetchColleges();
  }, []);

  const toggleBookmark = (name: string) => {
    let updated = [...savedColleges];
    if (updated.includes(name)) {
      updated = updated.filter(item => item !== name);
    } else {
      updated.push(name);
    }
    setSavedColleges(updated);
    localStorage.setItem('career_compass_saved_colleges', JSON.stringify(updated));
  };

  const collegeTypes = useMemo(() => {
    const typesSet = new Set(colleges.map(c => c.type));
    return Array.from(typesSet);
  }, [colleges]);

  const filteredColleges = useMemo(() => {
    return colleges.filter((clg) => {
      const matchesSearch = 
        (clg.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (clg.address?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (clg.popularCourses && Array.isArray(clg.popularCourses) 
          ? clg.popularCourses.some(course => course && course.toLowerCase().includes(searchQuery.toLowerCase()))
          : false);
      
      const matchesDistrict = selectedDistrict ? clg.district === selectedDistrict : true;
      const matchesType = selectedType ? clg.type === selectedType : true;
      
      const categoryVal = clg.category || 'Government';
      const matchesCategory = selectedCategory ? categoryVal === selectedCategory : true;

      return matchesSearch && matchesDistrict && matchesType && matchesCategory;
    });
  }, [colleges, searchQuery, selectedDistrict, selectedType, selectedCategory]);

  // Sync selected college for map view when filtered list changes
  useEffect(() => {
    if (filteredColleges.length > 0) {
      // If the current selection isn't in the filtered list, default to the first filtered college
      const isStillAvailable = selectedCollegeForMap && filteredColleges.some(c => c.id === selectedCollegeForMap.id);
      if (!isStillAvailable) {
        setSelectedCollegeForMap(filteredColleges[0]);
      }
    } else {
      setSelectedCollegeForMap(null);
    }
  }, [filteredColleges, selectedCollegeForMap]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedDistrict('');
    setSelectedType('');
    setSelectedCategory('');
  };

  const triggerMapView = (college: College) => {
    setSelectedCollegeForMap(college);
    setViewMode('map');
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

      {/* Directory Controls Tab Bar: Grid vs Map */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100 self-start">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
              viewMode === 'grid' 
                ? 'bg-white text-slate-950 shadow-sm border border-slate-100/50' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <List className="w-4 h-4 text-teal-600" />
            📋 Grid Directory
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
              viewMode === 'map' 
                ? 'bg-white text-slate-950 shadow-sm border border-slate-100/50' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Map className="w-4 h-4 text-teal-600" />
            🗺️ Interactive Map Explorer
          </button>
        </div>

        {/* Quick Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 self-start">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              selectedCategory === '' 
                ? 'bg-slate-950 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Sectors
          </button>
          <button
            onClick={() => setSelectedCategory('Government')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              selectedCategory === 'Government' 
                ? 'bg-teal-600 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Government
          </button>
          <button
            onClick={() => setSelectedCategory('Private')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              selectedCategory === 'Private' 
                ? 'bg-amber-600 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Private
          </button>
        </div>
      </div>

      {/* Advanced Filters Drawer */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
        
        {/* Row 1: Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Institution name, course offering, address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all text-xs font-semibold text-slate-700 placeholder-slate-400"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-0.5 rounded-full bg-slate-200 hover:bg-slate-300 transition-all text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
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

      {/* CORE DISPLAY MODES */}
      {viewMode === 'grid' ? (
        /* GRID DIRECTORY MODE */
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

                    {/* Bookmark Button overlaid top-right */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleBookmark(clg.name);
                      }}
                      className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/70 backdrop-blur-md border border-slate-800 text-white hover:bg-slate-950 hover:text-rose-500 transition-all cursor-pointer shadow-sm z-5 text-xs font-bold"
                    >
                      <Heart className={`w-4.5 h-4.5 ${savedColleges.includes(clg.name) ? 'text-rose-500 fill-rose-500' : 'text-white'}`} />
                    </button>

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

                  {/* Interactive Map Trigger Action */}
                  <div className="pt-1 flex gap-2">
                    <button
                      onClick={() => triggerMapView(clg)}
                      className="w-1/2 flex items-center justify-center gap-1.5 py-3 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border border-teal-100/50 cursor-pointer"
                    >
                      <Map className="w-4 h-4" />
                      Map Explorer
                    </button>
                    <button
                      onClick={() => setActiveModalCollege(clg)}
                      className="w-1/2 flex items-center justify-center gap-1.5 py-3 bg-slate-950 hover:bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                    >
                      <MapPin className="w-4 h-4 text-teal-400" />
                      View Campus Map
                    </button>
                  </div>

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
      ) : (
        /* MAP EXPLORER SPLIT PANE MODE */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[680px] bg-slate-50 border border-slate-100 rounded-[32px] p-4 lg:overflow-hidden shadow-inner">
          
          {/* Left Column: Colleges List Panel (col-span-5) */}
          <div className="lg:col-span-5 h-[400px] lg:h-full flex flex-col bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden">
            <div className="bg-slate-50 p-4 border-b border-slate-150 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-teal-600 animate-spin-slow" />
                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Matched Campuses</span>
              </div>
              <span className="bg-teal-100 text-teal-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                {filteredColleges.length} Colleges
              </span>
            </div>

            {/* List Loop */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {filteredColleges.map((clg) => {
                const isSelected = selectedCollegeForMap?.id === clg.id;
                return (
                  <button
                    key={clg.id}
                    onClick={() => setSelectedCollegeForMap(clg)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col space-y-1.5 cursor-pointer relative group ${
                      isSelected 
                        ? 'bg-teal-50/50 border-teal-500 shadow-sm ring-1 ring-teal-400' 
                        : 'bg-white border-slate-150 hover:bg-slate-50/70 hover:border-slate-300'
                    }`}
                  >
                    {/* Side Indicator Bar */}
                    {isSelected && (
                      <span className="absolute left-0 top-0 bottom-0 w-1 bg-teal-600 rounded-l-md" />
                    )}

                    <div className="flex items-start justify-between gap-1.5">
                      <h4 className={`text-xs font-extrabold transition-colors leading-tight line-clamp-1 ${
                        isSelected ? 'text-teal-950' : 'text-slate-800 group-hover:text-teal-600'
                      }`}>
                        {clg.name}
                      </h4>
                      <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 ${
                        clg.category === 'Private' ? 'bg-amber-100 text-amber-800' : 'bg-teal-100 text-teal-800'
                      }`}>
                        {clg.category || 'Government'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3.5 text-[10px] font-bold text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        {clg.district}
                      </span>
                      <span className="bg-slate-100 text-slate-600 text-[9px] px-1.5 py-0.5 rounded uppercase font-extrabold">
                        {clg.type}
                      </span>
                    </div>

                    {clg.lat && clg.lng && (
                      <div className="font-mono text-[9px] text-slate-400">
                        GPS: {clg.lat.toFixed(4)}°N, {clg.lng.toFixed(4)}°E
                      </div>
                    )}
                  </button>
                );
              })}

              {filteredColleges.length === 0 && (
                <div className="py-16 text-center space-y-2">
                  <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">No matching campus found</p>
                  <p className="text-[10px] text-slate-400 max-w-[200px] mx-auto leading-relaxed">
                    Adjust your district or search keywords to populate options.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Map Viewer (col-span-7) */}
          <div className="lg:col-span-7 h-[550px] lg:h-full flex flex-col bg-white rounded-2xl border border-slate-150 shadow-sm p-4 space-y-4">
            {selectedCollegeForMap ? (
              <div className="flex-1 flex flex-col space-y-3.5 overflow-hidden">
                
                {/* Selected Info Header */}
                <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-black bg-teal-600 text-white uppercase tracking-widest px-2 py-0.5 rounded-full">
                        {selectedCollegeForMap.category || 'Government'}
                      </span>
                      <span className="text-[9px] font-black bg-slate-900 text-white uppercase tracking-widest px-2 py-0.5 rounded-full">
                        {selectedCollegeForMap.type}
                      </span>
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-900 leading-snug line-clamp-1">
                      {selectedCollegeForMap.name}
                    </h3>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold">
                      <MapPin className="w-3 h-3 text-teal-500 shrink-0" />
                      <span>{selectedCollegeForMap.address}</span>
                    </div>
                  </div>

                  {/* GPS Coordinate Badge */}
                  {selectedCollegeForMap.lat && selectedCollegeForMap.lng && (
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 shrink-0 text-right font-mono text-[9px] text-slate-600 space-y-0.5 self-start">
                      <span className="block text-[8px] font-black uppercase text-slate-400 font-sans tracking-wider">Coordinates</span>
                      <span className="block font-black">{selectedCollegeForMap.lat.toFixed(5)}°N</span>
                      <span className="block font-black">{selectedCollegeForMap.lng.toFixed(5)}°E</span>
                    </div>
                  )}
                </div>

                {/* Map iframe Container */}
                <div className="flex-1 w-full bg-slate-50 rounded-2xl border border-slate-150 overflow-hidden relative shadow-inner min-h-[220px]">
                  <iframe
                    title={`Google Map for ${selectedCollegeForMap.name}`}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedCollegeForMap.name + ', ' + selectedCollegeForMap.district + ', Kerala, India')}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  <div className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800 text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                    Live Embedded GPS Campus Map
                  </div>
                </div>

                {/* Map Action Tray & Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  
                  {/* Left block: quick navigation button */}
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedCollegeForMap.name + ', ' + selectedCollegeForMap.district + ', Kerala, India')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-teal-600/15 cursor-pointer text-center"
                  >
                    <Navigation className="w-4 h-4 animate-bounce" />
                    Launch Directions App
                    <ExternalLink className="w-3 h-3 text-teal-200" />
                  </a>

                  {/* Right block: phone & contacts shortcut */}
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${selectedCollegeForMap.contactPhone}`}
                      className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-150 transition-all text-[10px] text-slate-700 font-bold uppercase tracking-wider cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5 text-teal-600" />
                      Call
                    </a>
                    <a
                      href={selectedCollegeForMap.website}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-150 transition-all text-[10px] text-slate-700 font-bold uppercase tracking-wider cursor-pointer"
                    >
                      <Globe className="w-3.5 h-3.5 text-indigo-600" />
                      Website
                    </a>
                  </div>

                </div>

                {/* Popular Courses Block */}
                {selectedCollegeForMap.popularCourses && selectedCollegeForMap.popularCourses.length > 0 && (
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-slate-400 tracking-wider">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      Degree Programs Offered
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCollegeForMap.popularCourses.map((course, idx) => (
                        <span key={idx} className="bg-white px-2 py-1 border border-slate-150 text-[10px] text-slate-700 font-bold rounded-md">
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 p-8">
                <Compass className="w-12 h-12 text-slate-300 animate-pulse" />
                <h3 className="text-base serif-italic font-normal text-slate-900">Select a College to Load Location</h3>
                <p className="text-xs text-slate-400 max-w-xs font-semibold leading-relaxed">
                  No institution selected. Choose an institution from the left side panel to explore its geographic coordinates and map coordinates.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* QUICK VIEW MAP MODAL */}
      <AnimatePresence>
        {activeModalCollege && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Modal Backdrop with Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModalCollege(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white w-full max-w-3xl rounded-[32px] border border-slate-100 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] z-10"
            >
              
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-teal-600 uppercase tracking-widest">
                    <MapPin className="w-3.5 h-3.5 animate-pulse text-teal-500" />
                    Campus Location Radar
                  </div>
                  <h3 className="text-lg md:text-xl font-extrabold text-slate-900 leading-snug">
                    {activeModalCollege.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {activeModalCollege.address}
                  </p>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setActiveModalCollege(null)}
                  className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-all cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body / Map */}
              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                
                {/* Geographic Badges Tray */}
                <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs text-slate-600">
                  <span className="font-extrabold uppercase text-[10px] text-slate-400">Sector:</span>
                  <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg font-bold text-teal-700">
                    {activeModalCollege.category || 'Government'}
                  </span>

                  <span className="font-extrabold uppercase text-[10px] text-slate-400">District:</span>
                  <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg font-bold">
                    {activeModalCollege.district}
                  </span>

                  {activeModalCollege.lat && activeModalCollege.lng && (
                    <>
                      <span className="font-extrabold uppercase text-[10px] text-slate-400">GPS Coords:</span>
                      <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg font-mono text-[11px]">
                        {activeModalCollege.lat.toFixed(5)}°N, {activeModalCollege.lng.toFixed(5)}°E
                      </span>
                    </>
                  )}
                </div>

                {/* Map IFrame */}
                <div className="w-full h-[320px] bg-slate-50 rounded-2xl border border-slate-150 overflow-hidden shadow-inner relative">
                  <iframe
                    title={`Google Map for ${activeModalCollege.name}`}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(activeModalCollege.name + ', ' + activeModalCollege.district + ', Kerala, India')}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800 text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-ping" />
                    Live Embedded GPS Campus Map
                  </div>
                </div>

                {/* Quick Directions Launch Button */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activeModalCollege.name + ', ' + activeModalCollege.district + ', Kerala, India')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-teal-600/15 cursor-pointer text-center"
                  >
                    <Navigation className="w-4 h-4 animate-bounce" />
                    Get Driving/Transit Directions
                    <ExternalLink className="w-3.5 h-3.5 text-teal-200" />
                  </a>
                  <button
                    onClick={() => {
                      triggerMapView(activeModalCollege);
                      setActiveModalCollege(null);
                    }}
                    className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer text-center"
                  >
                    Explore in Panel
                  </button>
                </div>

                {/* Contacts Summary */}
                <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-center">
                  <a
                    href={`tel:${activeModalCollege.contactPhone}`}
                    className="flex items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-150 transition-all font-bold text-xs text-slate-700"
                  >
                    <Phone className="w-4 h-4 text-teal-600" />
                    Call Institution Office
                  </a>
                  <a
                    href={activeModalCollege.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-150 transition-all font-bold text-xs text-slate-700"
                  >
                    <Globe className="w-4 h-4 text-indigo-600" />
                    Visit Official Site
                  </a>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
