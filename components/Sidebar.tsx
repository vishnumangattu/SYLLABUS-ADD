import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X, LayoutGrid } from 'lucide-react';
import { RoadmapContext } from '../context';
import { cn } from '../utils/cn';

const SidebarItem = ({ 
  item, 
  depth = 0, 
  onJump 
}) => {
  const { activeNodeId } = useContext(RoadmapContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = activeNodeId === item.id;

  const handleClick = (e) => {
    e.stopPropagation();
    onJump(item.id);
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="flex flex-col">
      <button
        onClick={handleClick}
        className={cn(
          "flex items-center gap-2 py-2 px-2 rounded-md transition-all duration-200 text-left group w-full relative",
          depth === 0 ? "mb-1 mt-2" : "",
          isActive 
            ? "bg-primary/10 text-primary border-r-2 border-primary" 
            : "hover:bg-slate-800/50 text-slate-400"
        )}
        style={{ paddingLeft: `${(depth * 12) + 12}px` }}
      >
        {/* Connection line for tree visual */}
        {depth > 0 && (
          <div className="absolute left-[5px] top-0 bottom-0 w-px bg-slate-800/50" 
               style={{ left: `${(depth * 12)}px` }} 
          />
        )}

        <span className={cn(
          "transition-transform duration-200 opacity-70",
          isExpanded ? "rotate-90" : "rotate-0",
          !hasChildren && "invisible",
          isActive ? "text-primary" : "text-slate-500"
        )}>
           <ChevronRight size={14} />
        </span>
        
        <span className={cn(
          "truncate flex-1 text-sm",
          depth === 0 ? "font-semibold text-slate-200" : "",
          isActive ? "font-semibold" : ""
        )}>
          {item.title}
        </span>
      </button>

      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {item.children?.map((child) => (
              <SidebarItem 
                key={child.id} 
                item={child} 
                depth={depth + 1} 
                onJump={onJump} 
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { focusNode, roadmapData, goHome } = useContext(RoadmapContext);

  const handleJump = (id) => {
    focusNode(id);
    if (window.innerWidth < 768) {
        setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-0 left-0 h-full w-72 bg-slate-950/95 border-r border-slate-800 z-50 flex flex-col shadow-2xl backdrop-blur-xl"
      >
        <div className="p-5 flex items-center justify-between border-b border-slate-800/50">
          <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Syllabus</h2>
              <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">Navigator</p>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="md:hidden p-1.5 hover:bg-slate-800 rounded-full text-slate-400"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
           {roadmapData.map((topic) => (
             <SidebarItem key={topic.id} item={topic} onJump={handleJump} />
           ))}
        </div>

        <div className="p-4 border-t border-slate-800/50 bg-slate-900/30 flex flex-col gap-3">
           <button 
             onClick={goHome}
             className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-sm font-medium border border-slate-700"
           >
             <LayoutGrid size={16} />
             <span>Switch Course</span>
           </button>
           <div className="flex items-center justify-between text-xs text-slate-600 font-mono">
              <span>SYNNEFO</span>
              <span>v1.0.0</span>
           </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;