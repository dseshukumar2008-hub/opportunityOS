import { useState, useMemo } from 'react';
import { 
  Search, Filter, 
  ChevronDown, ChevronUp, 
  RefreshCcw, ChevronLeft, ChevronRight, CheckCircle2, SearchX
} from 'lucide-react';
import EmptyState from '../../components/ui/EmptyState';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useApplications } from '../../contexts/ApplicationContext';
import { useSavedOpportunities } from '../../contexts/SavedOpportunitiesContext';
import { useLiveOpportunities } from '../../hooks/useLiveOpportunities';
import OpportunityCard from '../../components/opportunities/OpportunityCard';
import RecommendedForYouSection from '../../components/opportunities/RecommendedForYouSection';
import Skeleton from '../../components/ui/Skeleton';

export default function OpportunitiesPage() {
  const navigate = useNavigate();
  const { applications, addApplication } = useApplications();
  const [searchQuery, setSearchQuery] = useState('');
  const { opportunities: liveOpportunities, isLoading } = useLiveOpportunities();

  
  // Filter states
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedDurations, setSelectedDurations] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);


  
  // Accordion open states
  const [openFilterSections, setOpenFilterSections] = useState({
    type: true,
    location: true,
    duration: true,
    category: true
  });

  // Save Logic
  const { toggleSavedOpportunity, isSaved } = useSavedOpportunities();

  const handleApply = (e, opp) => {
    e.stopPropagation();
    const targetUrl = opp.url || opp.applyLink;
    if (targetUrl && targetUrl !== '#') {
      window.open(targetUrl, '_blank');
    } else {
      toast.error('Application link not available.');
    }
  };

  const filterSections = [
    {
      id: 'type',
      title: 'Opportunity Type',
      state: selectedTypes,
      setState: setSelectedTypes,
      options: ['Full-Time', 'Internship']
    },
    {
      id: 'location',
      title: 'Location',
      state: selectedLocations,
      setState: setSelectedLocations,
      options: ['Remote', 'Hybrid', 'Onsite']
    },
    {
      id: 'duration',
      title: 'Duration',
      state: selectedDurations,
      setState: setSelectedDurations,
      options: ['1 Month', '3 Months', '6 Months']
    },
    {
      id: 'category',
      title: 'Category',
      state: selectedCategories,
      setState: setSelectedCategories,
      options: ['Engineering', 'Design', 'Management', 'Product']
    }
  ];

  const handleToggle = (option, currentState, setState) => {
    setState(prev => 
      prev.includes(option) ? prev.filter(t => t !== option) : [...prev, option]
    );
  };

  const toggleFilterSection = (id) => {
    setOpenFilterSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const clearAllFilters = () => {
    setSelectedTypes([]);
    setSelectedLocations([]);
    setSelectedDurations([]);
    setSelectedCategories([]);
  };

  // Filter Logic
  const filteredOpportunities = useMemo(() => {
    return liveOpportunities.filter(opp => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = !query || 
        opp.title.toLowerCase().includes(query) || 
        opp.company.toLowerCase().includes(query) || 
        (opp.tags && opp.tags.some(tag => tag.label.toLowerCase().includes(query)));

      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(opp.type);
      
      const isRemote = opp.location.toLowerCase().includes('remote');
      let matchesLocation = true;
      if (selectedLocations.length > 0) {
        if (selectedLocations.includes('Remote') && isRemote) matchesLocation = true;
        else if (selectedLocations.includes('Onsite') && !isRemote) matchesLocation = true;
        else matchesLocation = false;
      }
      
      return matchesSearch && matchesType && matchesLocation;
    });
  }, [liveOpportunities, searchQuery, selectedTypes, selectedLocations]);

  return (
    <div className="max-w-[1600px] mx-auto flex flex-col h-full relative p-4 lg:p-6">
      {/* Recommended For You Section */}
      <RecommendedForYouSection limit={4} layout="grid" />

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="page-header">Opportunities</h1>
        <p className="page-subheader mt-0">Discover internships, hackathons, scholarships and competitions tailored for you.</p>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-[500px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by title, company or keyword..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search opportunities"
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] shadow-sm placeholder:text-slate-400 focus:outline-none focus:border-[#6C4CF1] focus:ring-4 focus:ring-[#6C4CF1]/10 transition-all"
          />
        </div>
        <div className="flex gap-3 shrink-0">
          <button 
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            aria-expanded={isMobileFiltersOpen}
            className="btn-secondary flex items-center gap-2 text-[14px] focus-visible:ring-2 focus-visible:ring-[#6C4CF1] focus-visible:outline-none"
          >
            <Filter size={16} />
            Filter
          </button>
        </div>
        <div className="flex-1" />
        <div className="relative group shrink-0">
          <button className="btn-secondary flex items-center gap-2 text-[14px] w-full sm:w-auto justify-between sm:justify-start">
            Sort by: <span className="text-slate-900">Newest</span>
            <ChevronDown size={16} className="text-slate-400 group-hover:text-slate-600 ml-1" />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        {/* Left Sidebar Filters */}
        <div className={`
          lg:w-[260px] shrink-0
          ${isMobileFiltersOpen ? 'block' : 'hidden lg:block'}
        `}>
          <div className="card-standard p-6">
            <h2 className="section-header mb-6">Filters</h2>
            
            <div className="space-y-6">
              {filterSections.map((section) => (
                <div key={section.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                  <button 
                    onClick={() => toggleFilterSection(section.id)}
                    aria-expanded={openFilterSections[section.id]}
                    className="flex items-center justify-between w-full text-left mb-4 group focus-visible:ring-2 focus-visible:ring-[#6C4CF1] focus-visible:outline-none rounded-lg p-1 -ml-1"
                  >
                    <h3 className="text-[14px] font-bold text-slate-900">{section.title}</h3>
                    {openFilterSections[section.id] ? (
                      <ChevronUp size={16} className="text-slate-400 group-hover:text-slate-600" />
                    ) : (
                      <ChevronDown size={16} className="text-slate-400 group-hover:text-slate-600" />
                    )}
                  </button>
                  
                  {openFilterSections[section.id] && (
                    <div className="space-y-3.5">
                      {section.options.map((option, optIdx) => (
                        <label key={optIdx} className="flex items-center gap-3 cursor-pointer group">
                          <div className={`
                            relative flex items-center justify-center w-[18px] h-[18px] rounded-[4px] border transition-colors
                            ${section.state.includes(option) ? 'bg-[#6C4CF1] border-[#6C4CF1]' : 'bg-white border-slate-300 group-hover:border-[#6C4CF1]'}
                          `}>
                            <input 
                              type="checkbox" 
                              className="peer opacity-0 absolute inset-0 cursor-pointer"
                              onChange={() => handleToggle(option, section.state, section.setState)}
                              checked={section.state.includes(option)}
                            />
                            {section.state.includes(option) && (
                              <CheckCircle2 size={12} className="text-white" strokeWidth={3} />
                            )}
                          </div>
                          <span className="text-[14px] text-slate-600 font-medium group-hover:text-slate-900 transition-colors">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button 
              onClick={clearAllFilters}
              className="mt-8 w-full py-3 flex items-center justify-center gap-2 border border-[#6C4CF1] text-[#6C4CF1] rounded-xl text-[14px] font-bold hover:bg-indigo-50 transition-colors"
            >
              <RefreshCcw size={14} />
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Right Content Area (Grid) */}
        <div className="flex-1 flex flex-col">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="animate-pulse bg-white rounded-2xl p-6 border border-slate-100 h-[280px]">
                  <div className="flex gap-4 mb-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-slate-200 rounded"></div>
                    <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredOpportunities.length === 0 ? (
            <EmptyState 
              icon={SearchX}
              title="No opportunities available right now."
              description="Check back later or adjust your filters."
              actionText="Clear Filters"
              onAction={() => {
                setSearchQuery('');
                setSelectedTypes([]);
                setSelectedLocations([]);
                setSelectedCategories([]);
              }}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {filteredOpportunities.map((opp) => (
                  <OpportunityCard 
                    key={opp.id} 
                    opp={opp} 
                    isSaved={isSaved(opp.id)} 
                    onSave={toggleSavedOpportunity} 
                    onApply={handleApply} 
                  />
                ))}
              </div>

              {/* Pagination Row */}
              <div className="mt-10 flex items-center justify-between bg-white px-6 py-4 rounded-[20px] border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
                <div className="flex-1" />
                <div className="flex items-center gap-1">
                  <button 
                    aria-label="Previous page"
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors focus-visible:ring-2 focus-visible:ring-[#6C4CF1] focus-visible:outline-none"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#6C4CF1] text-white text-[13px] font-bold shadow-sm">
                    1
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-50 text-[13px] font-bold transition-colors">
                    2
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-50 text-[13px] font-bold transition-colors">
                    3
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-50 text-[13px] font-bold transition-colors">
                    4
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-50 text-[13px] font-bold transition-colors">
                    5
                  </button>
                  <span className="w-8 h-8 flex items-center justify-center text-slate-400 text-[13px] font-bold">
                    ...
                  </span>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-50 text-[13px] font-bold transition-colors">
                    20
                  </button>
                  <button 
                    aria-label="Next page"
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors focus-visible:ring-2 focus-visible:ring-[#6C4CF1] focus-visible:outline-none"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                <div className="flex-1 flex justify-end">
                  <div className="relative group">
                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                      12 per page
                      <ChevronDown size={14} className="text-slate-400" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
