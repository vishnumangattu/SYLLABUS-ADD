import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Layers,
  FileText,
  Folder,
} from 'lucide-react';

// Generate unique IDs
const generateId = () => `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Module structure
interface Module {
  id: string;
  title: string;
  order: number;
  topics: Topic[];
}

interface Topic {
  id: string;
  title: string;
  subTopics: SubTopic[];
}

interface SubTopic {
  id: string;
  title: string;
}

interface SyllabusBuilderProps {
  data: any[]; // Existing data format
  onChange: (data: any[]) => void;
}

// Convert old format to new format
const convertToModules = (oldData: any[]): Module[] => {
  if (!oldData || oldData.length === 0) return [];
  
  return oldData.map((item, index) => ({
    id: item.id || generateId(),
    title: item.title || 'Untitled Module',
    order: index + 1,
    topics: (item.children || []).map((topic: any) => ({
      id: topic.id || generateId(),
      title: topic.title || 'Untitled Topic',
      subTopics: (topic.children || []).map((subTopic: any) => ({
        id: subTopic.id || generateId(),
        title: subTopic.title || 'Untitled Sub-topic',
      })),
    })),
  }));
};

// Convert new format back to old format
const convertToOldFormat = (modules: Module[]): any[] => {
  return modules.map((module) => ({
    id: module.id,
    title: module.title,
    category: 'general', // Default category
    children: module.topics.map((topic) => ({
      id: topic.id,
      title: topic.title,
      ...(topic.subTopics.length > 0 && {
        children: topic.subTopics.map((subTopic) => ({
          id: subTopic.id,
          title: subTopic.title,
        })),
      }),
    })),
  }));
};

// Sortable Module Item
const SortableModule = ({
  module,
  onEdit,
  onDelete,
  onAddTopic,
  onEditTopic,
  onDeleteTopic,
  onAddSubTopic,
  onEditSubTopic,
  onDeleteSubTopic,
  onReorderTopics,
  onReorderSubTopics,
}: {
  module: Module;
  onEdit: (id: string, title: string, order: number) => void;
  onDelete: (id: string) => void;
  onAddTopic: (moduleId: string) => void;
  onEditTopic: (moduleId: string, topicId: string, title: string) => void;
  onDeleteTopic: (moduleId: string, topicId: string) => void;
  onAddSubTopic: (moduleId: string, topicId: string) => void;
  onEditSubTopic: (moduleId: string, topicId: string, subTopicId: string, title: string) => void;
  onDeleteSubTopic: (moduleId: string, topicId: string, subTopicId: string) => void;
  onReorderTopics: (moduleId: string, activeId: string, overId: string) => void;
  onReorderSubTopics: (moduleId: string, topicId: string, activeId: string, overId: string) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [editTitle, setEditTitle] = useState(module.title);
  const [editOrder, setEditOrder] = useState(module.order.toString());

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Update local state when module prop changes
  React.useEffect(() => {
    setEditTitle(module.title);
    setEditOrder(module.order.toString());
  }, [module.title, module.order]);

  const handleSave = () => {
    const orderNum = parseInt(editOrder) || module.order;
    if (editTitle.trim() && (editTitle.trim() !== module.title || orderNum !== module.order)) {
      onEdit(module.id, editTitle.trim(), orderNum);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur(); // Trigger blur which calls handleSave
    } else if (e.key === 'Escape') {
      setEditTitle(module.title);
      setEditOrder(module.order.toString());
      e.currentTarget.blur();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-slate-800/50 border border-slate-700 rounded-lg mb-3"
    >
      <div className="flex items-center gap-2 p-4">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300"
        >
          <GripVertical size={18} />
        </div>

        <div className="flex-1 flex items-center gap-2">
          <input
            type="number"
            value={editOrder}
            onChange={(e) => setEditOrder(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className="w-16 bg-slate-900/50 border border-slate-600 rounded px-2 py-1 text-white text-sm hover:bg-slate-900 focus:bg-slate-900 focus:border-primary"
            placeholder="Order"
          />
          <Layers size={18} className="text-primary" />
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className="flex-1 bg-slate-900/50 border border-slate-600 rounded px-3 py-1 text-white font-semibold hover:bg-slate-900 focus:bg-slate-900 focus:border-primary"
            placeholder="Module title"
          />
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-400 hover:text-white"
        >
          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>
        <button
          type="button"
          onClick={() => onDelete(module.id)}
          className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-red-400"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-2">
          {module.topics.map((topic) => (
            <SortableTopic
              key={topic.id}
              moduleId={module.id}
              topic={topic}
              onEdit={(id, title) => onEditTopic(module.id, id, title)}
              onDelete={(id) => onDeleteTopic(module.id, id)}
              onAddSubTopic={() => onAddSubTopic(module.id, topic.id)}
              onEditSubTopic={(subTopicId, title) =>
                onEditSubTopic(module.id, topic.id, subTopicId, title)
              }
              onDeleteSubTopic={(subTopicId) =>
                onDeleteSubTopic(module.id, topic.id, subTopicId)
              }
              onReorderSubTopics={(activeId, overId) =>
                onReorderSubTopics(module.id, topic.id, activeId, overId)
              }
            />
          ))}
          <button
            type="button"
            onClick={() => onAddTopic(module.id)}
            className="w-full flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 border border-dashed border-slate-600 rounded text-slate-400 hover:text-white text-sm"
          >
            <Plus size={16} />
            Add Topic
          </button>
        </div>
      )}
    </div>
  );
};

// Sortable Topic Item
const SortableTopic = ({
  moduleId,
  topic,
  onEdit,
  onDelete,
  onAddSubTopic,
  onEditSubTopic,
  onDeleteSubTopic,
  onReorderSubTopics,
}: {
  moduleId: string;
  topic: Topic;
  onEdit: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onAddSubTopic: () => void;
  onEditSubTopic: (subTopicId: string, title: string) => void;
  onDeleteSubTopic: (subTopicId: string) => void;
  onReorderSubTopics: (activeId: string, overId: string) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [editTitle, setEditTitle] = useState(topic.title);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: topic.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Update local state when topic prop changes
  React.useEffect(() => {
    setEditTitle(topic.title);
  }, [topic.title]);

  const handleSave = () => {
    if (editTitle.trim() && editTitle.trim() !== topic.title) {
      onEdit(topic.id, editTitle.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur(); // Trigger blur which calls handleSave
    } else if (e.key === 'Escape') {
      setEditTitle(topic.title);
      e.currentTarget.blur();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-slate-900/50 border border-slate-600 rounded-lg ml-4 mb-2"
    >
      <div className="flex items-center gap-2 p-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300"
        >
          <GripVertical size={16} />
        </div>

        <FileText size={16} className="text-blue-400" />
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className="flex-1 bg-slate-800/50 border border-slate-600 rounded px-3 py-1 text-slate-300 text-sm hover:bg-slate-800 focus:bg-slate-800 focus:border-blue-400"
          placeholder="Topic title"
        />
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-500 hover:text-white"
        >
          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        <button
          type="button"
          onClick={() => onDelete(topic.id)}
          className="p-1 hover:bg-slate-700 rounded text-slate-500 hover:text-red-400"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {isExpanded && (
        <div className="px-3 pb-3 space-y-1">
          {topic.subTopics.map((subTopic) => (
            <SortableSubTopic
              key={subTopic.id}
              moduleId={moduleId}
              topicId={topic.id}
              subTopic={subTopic}
              onEdit={(id, title) => onEditSubTopic(id, title)}
              onDelete={(id) => onDeleteSubTopic(id)}
            />
          ))}
          <button
            type="button"
            onClick={onAddSubTopic}
            className="w-full flex items-center gap-2 px-2 py-1.5 bg-slate-800/50 hover:bg-slate-800 border border-dashed border-slate-600 rounded text-slate-500 hover:text-white text-xs ml-4"
          >
            <Plus size={14} />
            Add Sub-topic
          </button>
        </div>
      )}
    </div>
  );
};

// Sortable Sub-topic Item
const SortableSubTopic = ({
  moduleId,
  topicId,
  subTopic,
  onEdit,
  onDelete,
}: {
  moduleId: string;
  topicId: string;
  subTopic: SubTopic;
  onEdit: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}) => {
  const [editTitle, setEditTitle] = useState(subTopic.title);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: subTopic.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Update local state when subTopic prop changes
  React.useEffect(() => {
    setEditTitle(subTopic.title);
  }, [subTopic.title]);

  const handleSave = () => {
    if (editTitle.trim() && editTitle.trim() !== subTopic.title) {
      onEdit(subTopic.id, editTitle.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur(); // Trigger blur which calls handleSave
    } else if (e.key === 'Escape') {
      setEditTitle(subTopic.title);
      e.currentTarget.blur();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-slate-950/50 border border-slate-700 rounded ml-8 mb-1"
    >
      <div className="flex items-center gap-2 p-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-slate-600 hover:text-slate-400"
        >
          <GripVertical size={14} />
        </div>

        <Folder size={14} className="text-green-400" />
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className="flex-1 bg-slate-800/30 border border-slate-600 rounded px-2 py-1 text-slate-400 text-xs hover:bg-slate-800 focus:bg-slate-800 focus:border-green-400"
          placeholder="Sub-topic title"
        />
        <button
          type="button"
          onClick={() => onDelete(subTopic.id)}
          className="p-1 hover:bg-slate-700 rounded text-slate-600 hover:text-red-400"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
};

const SyllabusBuilder: React.FC<SyllabusBuilderProps> = ({ data, onChange }) => {
  const [modules, setModules] = useState<Module[]>(() => convertToModules(data));
  const [activeId, setActiveId] = useState<string | null>(null);
  const prevDataRef = useRef(data);
  const onChangeRef = useRef(onChange);

  // Update modules when data prop changes (only if actually different)
  React.useEffect(() => {
    const dataStr = JSON.stringify(data);
    const prevDataStr = JSON.stringify(prevDataRef.current);
    if (dataStr !== prevDataStr) {
      prevDataRef.current = data;
      setModules(convertToModules(data));
    }
  }, [data]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Update onChange ref
  React.useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Update parent when modules change (debounced to prevent excessive updates)
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      const oldFormat = convertToOldFormat(modules);
      onChangeRef.current(oldFormat);
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [modules]);

  const handleDragStart = useCallback((event: any) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    // Find what type of item we're dragging
    let activeType: 'module' | 'topic' | 'subtopic' = 'module';
    let activeModule: Module | null = null;
    let activeTopic: Topic | null = null;
    let activeSubTopic: SubTopic | null = null;

    setModules((prevModules) => {
      // Check if it's a module
      activeModule = prevModules.find((m) => m.id === active.id) || null;
      if (activeModule) {
        activeType = 'module';
      } else {
        // Check if it's a topic
        for (const module of prevModules) {
        const topic = module.topics.find((t) => t.id === active.id);
        if (topic) {
          activeType = 'topic';
          activeModule = module;
          activeTopic = topic;
          break;
        }
        // Check if it's a sub-topic
        for (const t of module.topics) {
          const subTopic = t.subTopics.find((st) => st.id === active.id);
          if (subTopic) {
            activeType = 'subtopic';
            activeModule = module;
            activeTopic = t;
            activeSubTopic = subTopic;
            break;
          }
        }
        if (activeType === 'subtopic') break;
      }
    }

      if (!activeModule) return prevModules;

      // Find what we're dropping on
      const overModule = prevModules.find((m) => m.id === over.id);
    let overTopic: Topic | null = null;
    let overSubTopic: SubTopic | null = null;

      if (overModule) {
        // Dropping on a module - only valid for modules
        if (activeType === 'module') {
          const oldIndex = prevModules.findIndex((m) => m.id === active.id);
          const newIndex = prevModules.findIndex((m) => m.id === over.id);
          const newModules = arrayMove(prevModules, oldIndex, newIndex);
          newModules.forEach((m, idx) => {
            m.order = idx + 1;
          });
          return newModules;
        }
        return prevModules;
      }

      // Check if dropping on a topic
      for (const module of prevModules) {
      const topic = module.topics.find((t) => t.id === over.id);
        if (topic) {
          if (activeType === 'topic' && activeModule.id === module.id) {
            // Reordering topics within same module
            const oldIndex = module.topics.findIndex((t) => t.id === active.id);
            const newIndex = module.topics.findIndex((t) => t.id === over.id);
            const newTopics = arrayMove(module.topics, oldIndex, newIndex);
            return prevModules.map((m) => (m.id === module.id ? { ...m, topics: newTopics } : m));
          }
          return prevModules;
        }
      // Check if dropping on a sub-topic
      for (const t of module.topics) {
        const subTopic = t.subTopics.find((st) => st.id === over.id);
        if (subTopic) {
          if (activeType === 'subtopic' && activeTopic && activeTopic.id === t.id) {
            // Reordering sub-topics within same topic
            const oldIndex = t.subTopics.findIndex((st) => st.id === active.id);
            const newIndex = t.subTopics.findIndex((st) => st.id === over.id);
            const newSubTopics = arrayMove(t.subTopics, oldIndex, newIndex);
            return prevModules.map((m) =>
              m.id === module.id
                ? {
                    ...m,
                    topics: m.topics.map((top) =>
                      top.id === t.id ? { ...top, subTopics: newSubTopics } : top
                    ),
                  }
                : m
            );
          }
          return prevModules;
        }
      }
      }

      return prevModules;
    });
  }, []);

  const addModule = useCallback(() => {
    setModules((prevModules) => {
      const newModule: Module = {
        id: generateId(),
        title: 'New Module',
        order: prevModules.length + 1,
        topics: [],
      };
      return [...prevModules, newModule];
    });
  }, []);

  const editModule = useCallback((id: string, title: string, order: number) => {
    setModules((prevModules) =>
      prevModules.map((m) => (m.id === id ? { ...m, title, order } : m)).sort((a, b) => a.order - b.order)
    );
  }, []);

  const deleteModule = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this module and all its content?')) {
      setModules((prevModules) => {
        const newModules = prevModules.filter((m) => m.id !== id);
        // Reorder remaining modules
        newModules.forEach((m, idx) => {
          m.order = idx + 1;
        });
        return newModules;
      });
    }
  }, []);

  const addTopic = useCallback((moduleId: string) => {
    setModules((prevModules) => {
      const newTopic: Topic = {
        id: generateId(),
        title: 'New Topic',
        subTopics: [],
      };
      return prevModules.map((m) =>
        m.id === moduleId ? { ...m, topics: [...m.topics, newTopic] } : m
      );
    });
  }, []);

  const editTopic = useCallback((moduleId: string, topicId: string, title: string) => {
    setModules((prevModules) =>
      prevModules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              topics: m.topics.map((t) => (t.id === topicId ? { ...t, title } : t)),
            }
          : m
      )
    );
  }, []);

  const deleteTopic = useCallback((moduleId: string, topicId: string) => {
    if (window.confirm('Are you sure you want to delete this topic and all its sub-topics?')) {
      setModules((prevModules) =>
        prevModules.map((m) =>
          m.id === moduleId
            ? { ...m, topics: m.topics.filter((t) => t.id !== topicId) }
            : m
        )
      );
    }
  }, []);

  const addSubTopic = useCallback((moduleId: string, topicId: string) => {
    setModules((prevModules) => {
      const newSubTopic: SubTopic = {
        id: generateId(),
        title: 'New Sub-topic',
      };
      return prevModules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              topics: m.topics.map((t) =>
                t.id === topicId ? { ...t, subTopics: [...t.subTopics, newSubTopic] } : t
              ),
            }
          : m
      );
    });
  }, []);

  const editSubTopic = useCallback((moduleId: string, topicId: string, subTopicId: string, title: string) => {
    setModules((prevModules) =>
      prevModules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              topics: m.topics.map((t) =>
                t.id === topicId
                  ? {
                      ...t,
                      subTopics: t.subTopics.map((st) =>
                        st.id === subTopicId ? { ...st, title } : st
                      ),
                    }
                  : t
              ),
            }
          : m
      )
    );
  }, []);

  const deleteSubTopic = useCallback((moduleId: string, topicId: string, subTopicId: string) => {
    if (window.confirm('Are you sure you want to delete this sub-topic?')) {
      setModules((prevModules) =>
        prevModules.map((m) =>
          m.id === moduleId
            ? {
                ...m,
                topics: m.topics.map((t) =>
                  t.id === topicId
                    ? { ...t, subTopics: t.subTopics.filter((st) => st.id !== subTopicId) }
                    : t
                ),
              }
            : m
        )
      );
    }
  }, []);

  // Memoize IDs to prevent unnecessary re-renders
  const allIds = useMemo(() => {
    const moduleIds = modules.map((m) => m.id);
    const allTopicIds = modules.flatMap((m) => m.topics.map((t) => t.id));
    const allSubTopicIds = modules.flatMap((m) =>
      m.topics.flatMap((t) => t.subTopics.map((st) => st.id))
    );
    return [...moduleIds, ...allTopicIds, ...allSubTopicIds];
  }, [modules]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <label className="block text-sm font-semibold text-slate-300">
          Syllabus / Roadmap Builder
        </label>
        <button
          type="button"
          onClick={addModule}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-orange-600 text-white rounded-lg text-sm font-medium"
        >
          <Plus size={18} />
          Add Module
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={allIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar p-2">
            {modules.length === 0 ? (
              <div className="text-center py-12 bg-slate-900/30 rounded-lg border border-dashed border-slate-700">
                <p className="text-slate-500 text-sm">
                  No modules yet. Click "Add Module" to get started.
                </p>
              </div>
            ) : (
              modules.map((module) => (
                <SortableModule
                  key={module.id}
                  module={module}
                  onEdit={editModule}
                  onDelete={deleteModule}
                  onAddTopic={addTopic}
                  onEditTopic={editTopic}
                  onDeleteTopic={deleteTopic}
                  onAddSubTopic={addSubTopic}
                  onEditSubTopic={editSubTopic}
                  onDeleteSubTopic={deleteSubTopic}
                  onReorderTopics={() => {}}
                  onReorderSubTopics={() => {}}
                />
              ))
            )}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeId ? (
            <div className="bg-slate-800 border border-primary rounded-lg p-4 opacity-90">
              <p className="text-white">Dragging...</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default SyllabusBuilder;

