import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, Circle, Hash, Code, Database, Layout, Terminal } from 'lucide-react';
import { RoadmapContext } from '../context';
import { cn, getCategoryColor, getGlowColor } from '../utils/cn';

const RoadmapNode = ({ topic, depth = 0, isLast = false }) => {
  const { expandedNodes, toggleNode, searchTerm, activeNodeId } = useContext(RoadmapContext);
  const isExpanded = expandedNodes.has(topic.id);
  const hasChildren = topic.children && topic.children.length > 0;
  
  // Search & Active State
  const isMatch = searchTerm && topic.title.toLowerCase().includes(searchTerm.toLowerCase());
  const isActive = activeNodeId === topic.id;
  
  // Styles based on depth
  const isMainNode = depth === 0;
  
  // Icon Selection
  const getIcon = () => {
    if (topic.category === 'frontend') return <Layout size={16} />;
    if (topic.category === 'backend') return <Database size={16} />;
    if (topic.category === 'python') return <Terminal size={16} />;
    if (topic.category === 'devops') return <Code size={16} />;
    return hasChildren ? <Hash size={14} /> : <Circle size={8} className="fill-current" />;
  };

  const glowColor = getGlowColor(topic.category);
  const categoryColor = getCategoryColor(topic.category);

  // --- Main Node (Level 0) Design ---
  if (isMainNode) {
    return (
      <div className="relative flex flex-col items-center w-full">
        {/* Central Spine Line (Above) */}
        <div className="w-1 h-8 bg-slate-800"></div>

        <motion.div
          layout
          id={topic.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={(e) => {
            e.stopPropagation();
            toggleNode(topic.id);
          }}
          className={cn(
            "relative z-10 flex flex-col items-center justify-center p-6 rounded-2xl border-2 backdrop-blur-xl cursor-pointer transition-all duration-300 w-full max-w-md group",
            categoryColor,
            "bg-slate-900/80 hover:bg-slate-800/80",
            (isMatch || isActive) ? "ring-4 ring-white/20 scale-105" : "",
            isActive ? `shadow-[0_0_50px_${glowColor}40]` : "shadow-xl"
          )}
          whileHover={{ y: -4 }}
        >
           {/* Node Glow */}
           <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
           
           <div className="flex items-center gap-3 mb-2">
             <span className="p-2 rounded-lg bg-white/10">{getIcon()}</span>
             <h3 className="text-xl font-bold tracking-tight">{topic.title}</h3>
           </div>
           
           {topic.category && (
             <span className="text-[10px] font-mono uppercase tracking-widest opacity-60 bg-white/5 px-2 py-1 rounded">
               {topic.category}
             </span>
           )}

           {hasChildren && (
             <div className="mt-4">
               <ChevronDown 
                 size={20} 
                 className={cn("transition-transform duration-300 opacity-50", isExpanded ? "rotate-180" : "")} 
               />
             </div>
           )}
        </motion.div>

        {/* Central Spine Line (Below - connects to children or next node) */}
        {!isLast && !isExpanded && <div className="w-1 h-8 bg-slate-800"></div>}
        {isExpanded && hasChildren && <div className="w-1 h-8 bg-slate-800"></div>}

        {/* Children Render (Tree Structure) */}
        <AnimatePresence>
          {isExpanded && hasChildren && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-col items-start w-full max-w-2xl px-4 relative"
            >
               {/* Vertical Tree Trunk Line */}
               <div className="absolute left-[50%] top-0 bottom-6 w-px bg-slate-700 -translate-x-1/2 hidden md:block"></div>

              {/* Grid for Level 1 items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 w-full pt-4 pb-8">
                 {topic.children.map((child, index) => {
                   return (
                      <RoadmapNode 
                        key={child.id} 
                        topic={child} 
                        depth={depth + 1} 
                        isLast={index === topic.children.length - 1} 
                      />
                   );
                 })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {!isLast && <div className="w-1 h-8 bg-slate-800"></div>}
      </div>
    );
  }

  // --- Sub Node (Depth > 0) Design ---
  return (
    <div className="relative w-full">
      <div className="flex items-start group">
        
        {/* Tree Connectors */}
        <div className="absolute left-[-20px] top-0 bottom-0 w-[2px] bg-slate-800/50 md:hidden"></div> {/* Mobile Line */}
        
        {/* Desktop Tree Logic for Grid Item */}
        {depth === 1 ? (
           // Level 1: Does not need the complex curved line from left, handled by grid layout mostly
           // But let's add a top connector
           <div className="hidden md:block absolute top-[-16px] left-1/2 w-px h-4 bg-slate-700 -translate-x-1/2"></div>
        ) : (
           // Level 2+: Curved line from parent
           <>
            {/* Vertical Line from parent */}
            <div className="absolute left-[-16px] top-[-10px] bottom-0 w-px bg-slate-700"></div>
            {/* Horizontal Curve to node */}
            <div className="absolute left-[-16px] top-[24px] w-4 h-px bg-slate-700"></div>
            {/* Cover bottom line if last item */}
            {isLast && (
               <div className="absolute left-[-16px] top-[24px] bottom-0 w-[2px] bg-[#030712]"></div>
            )}
           </>
        )}

        <motion.div
          layout
          id={topic.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          <div 
            onClick={(e) => {
              e.stopPropagation();
              toggleNode(topic.id);
            }}
            className={cn(
              "relative flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer select-none",
              "bg-slate-800/40 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600",
              (isMatch || isActive) ? "ring-2 ring-primary/50 bg-slate-800" : "",
              isActive ? "shadow-[0_0_15px_rgba(6,182,212,0.2)]" : ""
            )}
          >
             <div className={cn("text-slate-400 group-hover:text-primary transition-colors", isExpanded ? "rotate-90" : "")}>
                {hasChildren ? <ChevronRight size={16} /> : <Circle size={6} className="fill-slate-600" />}
             </div>
             
             <div className="flex-1">
               <span className={cn("text-sm font-medium text-slate-200 group-hover:text-white", isMatch && "text-primary")}>
                 {topic.title}
               </span>
             </div>
          </div>

          {/* Recursive Children (Level 2+) */}
          <AnimatePresence>
            {isExpanded && hasChildren && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pl-6 pt-2 pb-1 relative"
              >
                {topic.children.map((child, index) => (
                  <RoadmapNode 
                    key={child.id} 
                    topic={child} 
                    depth={depth + 1}
                    isLast={index === topic.children.length - 1}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default React.memo(RoadmapNode);