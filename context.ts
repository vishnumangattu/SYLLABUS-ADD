import { createContext } from 'react';

export const RoadmapContext = createContext({
  roadmapData: [],
  searchTerm: '',
  setSearchTerm: (term: any) => {},
  is3DMode: false,
  toggle3DMode: () => {},
  expandedNodes: new Set(),
  toggleNode: (id: any) => {},
  expandAll: () => {},
  collapseAll: () => {},
  focusNode: (id: any) => {},
  activeNodeId: null,
  goHome: () => {},
  noMatch: false,
});