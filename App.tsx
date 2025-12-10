import React, { useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { fetchCourses, fetchCourseDetails } from './api'; 
import { courses as staticCourses } from './data'; // Fallback Data
import RoadmapNode from './components/RoadmapNode';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './components/Home';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import CourseEditor from './components/CourseEditor';
import { RoadmapContext } from './context';
import { WifiOff } from 'lucide-react';

// Helper to find all IDs in data
const getAllIds = (nodes) => {
  let ids = [];
  nodes.forEach(node => {
    ids.push(node.id);
    if (node.children) ids = [...ids, ...getAllIds(node.children)];
  });
  return ids;
};

// Helper to find path to a searched node (populates Set)
const findPathToNode = (nodes, term, path = new Set()) => {
  let found = false;
  for (const node of nodes) {
    const selfMatch = node.title.toLowerCase().includes(term.toLowerCase());
    let childFound = false;
    
    if (node.children) {
      childFound = findPathToNode(node.children, term, path);
    }
    
    if (selfMatch || childFound) {
      path.add(node.id);
      found = true;
    }
  }
  return found;
};

// Helper to find the FIRST matching node ID for scrolling
const findFirstMatchId = (nodes, term) => {
  for (const node of nodes) {
    if (node.title.toLowerCase().includes(term.toLowerCase())) {
      return node.id;
    }
    if (node.children) {
      const childMatch = findFirstMatchId(node.children, term);
      if (childMatch) return childMatch;
    }
  }
  return null;
};

// Helper to find specific path array for focusing
const findPath = (nodes, targetId, path = []) => {
  for (const node of nodes) {
    if (node.id === targetId) return [...path, node.id];
    if (node.children) {
      const result = findPath(node.children, targetId, [...path, node.id]);
      if (result) return result;
    }
  }
  return null;
};

export default function App() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [is3DMode, setIs3DMode] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [noMatch, setNoMatch] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  // Admin / Routing States
  const [editCourseId, setEditCourseId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Load Courses on Mount
  const loadCourses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchCourses();
      console.log(res.data);
      
      setCourses(res.data);
      setIsOffline(false);
      setLoading(false);
    } catch (err) {
      console.warn("API unavailable, using static data.");
      // Fallback to static data
      setCourses(staticCourses);
      setIsOffline(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
    const handleResize = () => {
       if (window.innerWidth >= 768) {
         setIsSidebarOpen(true);
       } else {
         setIsSidebarOpen(false);
       }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [loadCourses]);

  // --- Parallax & 3D Scroll Effects ---
  const { scrollY } = useScroll();
  
  // Layer 1: Background Grid (Moves slow, creating distance)
  const yGrid = useTransform(scrollY, [0, 1000], [0, 200]);
  
  // Layer 2: Glowing Orbs (Move at different speeds/directions for dynamic feel)
  const yOrbPrimary = useTransform(scrollY, [0, 1000], [0, -150]);
  const yOrbSecondary = useTransform(scrollY, [0, 1000], [0, 300]);
  
  // Layer 3: Floating Particles (Fast movement for foreground depth)
  const yParticle1 = useTransform(scrollY, [0, 1000], [0, -400]);
  const yParticle2 = useTransform(scrollY, [0, 1000], [0, 500]);

  // Main Container 3D Tilt
  // Starts tilted (25deg) and flattens out (0deg) as user scrolls down
  const rotateX = useSpring(useTransform(scrollY, [0, 600], [25, 0]), { stiffness: 80, damping: 20 });
  const scale = useSpring(useTransform(scrollY, [0, 600], [0.9, 1]), { stiffness: 80, damping: 20 });
  const containerOpacity = useTransform(scrollY, [0, 200], [0.9, 1]);

  // Handle Course Selection
  const handleSelectCourse = async (courseSummary) => {
     let fullCourse;
     
     try {
       // Fetch full details including the data tree
       const res = await fetchCourseDetails(courseSummary.id);
       fullCourse = res.data;
       setIsOffline(false);
     } catch (err) {
       console.warn("API failed, loading local details", err);
       // Fallback to static lookup
       const found = staticCourses.find(c => c.id === courseSummary.id);
       if (found) {
         fullCourse = found;
         setIsOffline(true);
       } else {
         console.error("Course not found in static data");
         return;
       }
     }
       
     setSelectedCourse(fullCourse);
     navigate('/roadmap');

     if (fullCourse.data && fullCourse.data.length > 0) {
       setExpandedNodes(new Set([fullCourse.data[0].id]));
     }
     
     window.scrollTo(0,0);
     setSearchTerm('');
     setNoMatch(false);
     setActiveNodeId(null);
     if (window.innerWidth >= 768) setIsSidebarOpen(true);
  };

  const goHome = () => {
    setSelectedCourse(null);
    navigate('/');
    setSearchTerm('');
    setActiveNodeId(null);
    setNoMatch(false);
  };

  // Admin Handlers
  const handleLoginSuccess = () => {
    navigate('/admin-dashboard');
  };

  const handleEditCourse = (id) => {
    setEditCourseId(id);
    navigate('/course-editor');
  };

  const handleCreateCourse = () => {
    setEditCourseId(null);
    navigate('/course-editor');
  };

  const handleEditorSave = () => {
    loadCourses(); // Refresh list
    navigate('/admin-dashboard');
  };

  // Handle Search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (location.pathname === '/roadmap' && selectedCourse && searchTerm.length > 1) {
        const newExpanded = new Set();
        const found = findPathToNode(selectedCourse.data, searchTerm, newExpanded);
        
        if (found) {
          setNoMatch(false);
          setExpandedNodes(newExpanded);
          const firstId = findFirstMatchId(selectedCourse.data, searchTerm);
          if (firstId) {
             setActiveNodeId(firstId);
             setTimeout(() => {
               const el = document.getElementById(firstId);
               if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
             }, 300);
          }
        } else {
          setNoMatch(true);
        }
      } else {
        setNoMatch(false);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm, selectedCourse, location.pathname]);

  const toggleNode = useCallback((id) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    if (selectedCourse) {
      setExpandedNodes(new Set(getAllIds(selectedCourse.data)));
    }
  }, [selectedCourse]);

  const collapseAll = useCallback(() => {
    setExpandedNodes(new Set());
  }, []);

  const focusNode = useCallback((id) => {
    if (!selectedCourse) return;
    const path = findPath(selectedCourse.data, id);
    if (path) {
      setExpandedNodes(prev => {
        const next = new Set(prev);
        path.forEach(p => next.add(p));
        return next;
      });
      setActiveNodeId(id);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
    }
  }, [selectedCourse]);

  const toggle3DMode = () => setIs3DMode(!is3DMode);
  const currentData = selectedCourse ? selectedCourse.data : [];

  return (
    <RoadmapContext.Provider value={{
      roadmapData: currentData,
      searchTerm,
      setSearchTerm,
      is3DMode,
      toggle3DMode,
      expandedNodes,
      toggleNode,
      expandAll,
      collapseAll,
      focusNode,
      activeNodeId,
      goHome,
      noMatch
    }}>
      <div className="min-h-screen text-slate-200 selection:bg-primary/30 selection:text-white font-sans relative">
        
        {/* --- DYNAMIC BACKGROUND & PARALLAX --- */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none perspective-1000">
           {/* Base Gradient */}
           <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-[#020617] to-slate-950" />
           
           {/* Layer 1: Grid Plane (Slow Movement) */}
           <motion.div 
             style={{ 
               rotateX: is3DMode ? 60 : 0, 
               scale: 2,
               opacity: 0.25,
               y: yGrid
             }}
             className="absolute inset-0 transition-transform duration-1000 ease-in-out origin-top"
           >
              <div className="w-full h-[200%] bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
           </motion.div>

           {/* Layer 2: Glowing Orbs (Mid Movement) */}
           <motion.div 
             style={{ y: yOrbPrimary }}
             className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[128px] opacity-60 mix-blend-screen"
           />
           <motion.div 
             style={{ y: yOrbSecondary }}
             className="absolute bottom-0 right-[-10%] w-[700px] h-[700px] bg-secondary/10 rounded-full blur-[128px] opacity-60 mix-blend-screen" 
           />

           {/* Layer 3: Floating Accents (Fast Movement) */}
           <motion.div
             style={{ y: yParticle1, x: 50 }}
             className="absolute top-[30%] right-[15%] w-32 h-32 bg-accent/5 rounded-full blur-[64px]"
           />
           <motion.div
             style={{ y: yParticle2, x: -50 }}
             className="absolute top-[70%] left-[5%] w-24 h-24 bg-indigo-500/10 rounded-full blur-[40px]"
           />
        </div>

        {/* Offline Indicator */}
        {isOffline && (
          <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-500 text-xs font-mono backdrop-blur-md">
            <WifiOff size={14} />
            <span>Offline Mode</span>
          </div>
        )}

        {/* Routes */}
        <Routes>
          <Route 
            path="/" 
            element={
              loading ? (
                <div className="flex h-screen items-center justify-center text-slate-400">Loading courses...</div>
              ) : (
                <Home courses={courses} onSelectCourse={handleSelectCourse} />
              )
            } 
          />
          
          <Route 
            path="/adminlogin" 
            element={
              <AdminLogin 
                onLoginSuccess={handleLoginSuccess} 
                onCancel={() => navigate('/')} 
              />
            } 
          />

          <Route 
            path="/admin-dashboard" 
            element={
              <AdminDashboard 
                courses={courses} 
                onEdit={handleEditCourse} 
                onCreate={handleCreateCourse} 
                onLogout={() => {
                  localStorage.removeItem('token');
                  navigate('/');
                }}
                onRefresh={loadCourses}
              />
            } 
          />

          <Route 
            path="/course-editor" 
            element={
              <div className="min-h-screen pt-10 px-4">
                <CourseEditor 
                  courseId={editCourseId} 
                  onSave={handleEditorSave} 
                  onCancel={() => navigate('/admin-dashboard')} 
                />
              </div>
            } 
          />

          <Route 
            path="/roadmap" 
            element={
              selectedCourse ? (
                <>
                  <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
                  <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                  <main className={`pt-24 pb-20 px-4 transition-all duration-300 ${isSidebarOpen ? 'md:ml-72' : 'ml-0'}`}>
                    <div className="max-w-4xl mx-auto perspective-1000">
                      <motion.div
                        style={is3DMode ? { 
                          rotateX: rotateX, 
                          scale: scale, 
                          opacity: containerOpacity,
                          transformStyle: 'preserve-3d' 
                        } : {}}
                        className="relative flex flex-col items-center transition-all duration-500 ease-out pb-32"
                      >
                        <div className="flex flex-col items-center mb-0 opacity-80">
                          <div className="px-4 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs text-slate-400 font-mono tracking-widest uppercase mb-2">Start</div>
                          <div className="w-px h-8 bg-gradient-to-b from-transparent to-slate-800"></div>
                        </div>
                        {currentData.map((topic, index) => (
                          <RoadmapNode key={topic.id} topic={topic} isLast={index === currentData.length - 1} />
                        ))}
                        <div className="flex flex-col items-center mt-0 opacity-80">
                          <div className="w-px h-8 bg-gradient-to-b from-slate-800 to-transparent"></div>
                          <div className="px-4 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs text-slate-400 font-mono tracking-widest uppercase mt-2">Goal Reached</div>
                        </div>
                      </motion.div>
                    </div>
                  </main>
                </>
              ) : (
                <div className="flex h-screen items-center justify-center">
                  <button onClick={goHome} className="text-primary hover:text-orange-400">
                    No course selected. Go back to home.
                  </button>
                </div>
              )
            }
          />
        </Routes>
      </div>
    </RoadmapContext.Provider>
  );
}