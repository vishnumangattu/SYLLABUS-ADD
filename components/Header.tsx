import React, { useContext } from 'react';
import { Menu, Search, Box, Layers, Maximize2, Minimize2, ChevronLeft, Shield } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { RoadmapContext } from '../context';
import { cn } from '../utils/cn';

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const { searchTerm, setSearchTerm, is3DMode, toggle3DMode, expandAll, collapseAll, goHome, noMatch } = useContext(RoadmapContext);
  const location = useLocation();

  return (
    <header 
      className={cn(
        "fixed top-0 right-0 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 z-40 px-4 md:px-8 flex items-center justify-between transition-all duration-300 ease-in-out",
        isSidebarOpen ? "left-0 md:left-72" : "left-0"
      )}
    >
      <div className="flex items-center gap-3">
        {/* Mobile Sidebar Toggle */}
        <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors md:hidden text-slate-300 mr-1"
          aria-label="Toggle Menu"
        >
          <Menu size={20} />
        </button>
        
        {/* Mobile Divider */}
        <div className="h-6 w-px bg-slate-800 md:hidden"></div>

        {/* Back Button */}
        <button 
          onClick={goHome}
          className="flex items-center gap-2 py-1.5 px-3 hover:bg-slate-800 rounded-lg transition-all text-slate-300 hover:text-white group border border-transparent hover:border-slate-700"
          title="Back to Course Selection"
        >
          <ChevronLeft size={18} className="text-primary group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-sm">Back</span>
        </button>

        {/* Branding (Hidden if Sidebar is open on Desktop to avoid redundancy, or kept for style) */}
        {/* We keep it but visually it's distinct from sidebar now */}
        <div className="hidden lg:flex flex-col border-l border-slate-800 pl-4 ml-2">
            <h1 className="text-lg font-bold tracking-tight text-white">
              Synnefo <span className="text-primary">Roadmap</span>
            </h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-xl mx-4 relative hidden sm:block group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
          <Search size={16} />
        </div>
        <input
          type="text"
          placeholder="Search topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={cn(
            "w-full bg-slate-900/50 border rounded-full py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:ring-2 transition-all placeholder:text-slate-600",
            noMatch 
              ? "border-red-500/50 focus:ring-red-500/20" 
              : "border-slate-800 focus:ring-primary/50"
          )}
        />
        {noMatch && (
          <div className="absolute top-full left-0 mt-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 text-xs font-medium animate-in fade-in slide-in-from-top-1">
            No results found
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center bg-slate-800/50 rounded-lg p-1 mr-2">
             <button 
                onClick={expandAll}
                className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                title="Expand All"
             >
               <Maximize2 size={16} />
             </button>
             <button 
                onClick={collapseAll}
                className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                title="Collapse All"
             >
               <Minimize2 size={16} />
             </button>
        </div>

        <button
          onClick={toggle3DMode}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
            is3DMode 
              ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(249,115,22,0.3)]' 
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
          }`}
        >
          {is3DMode ? <Box size={18} /> : <Layers size={18} />}
          <span className="text-xs font-semibold hidden sm:inline">{is3DMode ? '3D VIEW' : '2D VIEW'}</span>
        </button>

        {/* Admin Login Tab */}
        <Link
          to="/adminlogin"
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all",
            location.pathname === '/adminlogin'
              ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(249,115,22,0.3)]'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
          )}
        >
          <Shield size={18} />
          <span className="text-xs font-semibold hidden sm:inline">Admin</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;