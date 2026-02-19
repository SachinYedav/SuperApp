import React from 'react';
import { DndContext, closestCenter, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { RotateCw, Trash2, CheckCircle, ImageIcon, FileText, Grid } from 'lucide-react';

// --- CARD COMPONENT ---
function SortableItem({ page, index, selectionMode, toggleSelection, rotatePage, deletePage }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: page.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 1,
    touchAction: 'pan-y' 
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      onClick={() => selectionMode ? toggleSelection(index) : null}
      className={`group relative bg-white dark:bg-slate-800 rounded-xl shadow-sm transition-all overflow-hidden border-2 cursor-grab active:cursor-grabbing aspect-[3/4]
      ${page.selected && selectionMode ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900' : 'border-transparent hover:shadow-md'}`}
    >
       {/* Badge */}
       <div className="absolute top-2 left-2 flex gap-1 z-10 pointer-events-none">
         <span className="bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-md backdrop-blur-sm font-bold shadow-sm">
           {index + 1}
         </span>
         <span className={`text-[10px] px-1.5 py-0.5 rounded-md flex items-center text-white ${page.type === 'image' ? 'bg-blue-500' : 'bg-red-500'}`}>
            {page.type === 'image' ? <ImageIcon size={10}/> : <FileText size={10}/>}
         </span>
       </div>

       {/* Selection Mode Checkbox */}
       {selectionMode && (
         <div className={`absolute top-2 right-2 z-10 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
           ${page.selected ? 'bg-blue-500 border-blue-500' : 'bg-white/80 border-slate-300'}`}>
           {page.selected && <CheckCircle size={12} className="text-white" />}
         </div>
       )}

       {/* Actions */}
       {!selectionMode && !isDragging && (
         <div className="absolute inset-0 bg-black/10 lg:bg-black/40 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
             <button 
               onPointerDown={e=>e.stopPropagation()} 
               onClick={e=>{e.stopPropagation(); rotatePage(index)}} 
               className="p-2 bg-white text-slate-800 rounded-full hover:bg-blue-50 hover:text-blue-600 shadow-lg" 
               title="Rotate">
               <RotateCw size={16} />
             </button>
             <button 
               onPointerDown={e=>e.stopPropagation()} 
               onClick={e=>{e.stopPropagation(); deletePage(index)}} 
               className="p-2 bg-white text-red-500 rounded-full hover:bg-red-50 shadow-lg" 
               title="Delete">
               <Trash2 size={16} />
             </button>
         </div>
       )}

       {/* Thumbnail */}
       <div className="w-full h-full bg-slate-100 dark:bg-slate-900/50 flex items-center justify-center p-2">
         <img 
           src={page.src} 
           alt="preview" 
           className="max-w-full max-h-full object-contain shadow-sm pointer-events-none"
           style={{ transform: `rotate(${page.rotation}deg)` }}
         />
       </div>
    </div>
  );
}

// --- MAIN GRID ---
export default function PageGrid({ pages, setPages, selectionMode, toggleSelection, rotatePage, deletePage }) {

  // Improved sensors for mobile scroll vs drag
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 300,      // hold time before drag starts
        tolerance: 10    // finger movement allowed before drag
      }
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setPages((items) => {
      const oldIndex = items.findIndex(i => i.id === active.id);
      const newIndex = items.findIndex(i => i.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  return (
    <div className="flex-1 h-full flex flex-col p-2 lg:p-4 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-950/50 pb-32 lg:pb-4">
      {pages.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={pages.map(p => p.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 lg:gap-4">
              {pages.map((page, index) => (
                <SortableItem 
                  key={page.id}
                  page={page}
                  index={index}
                  selectionMode={selectionMode}
                  toggleSelection={toggleSelection}
                  rotatePage={rotatePage}
                  deletePage={deletePage}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 animate-fade-in min-h-[50vh]">
          <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <Grid size={32} className="text-slate-400 opacity-50" />
          </div>
          <p className="font-medium text-lg">No pages loaded</p>
          <p className="text-sm opacity-60">Tap "Add Files" to start</p>
        </div>
      )}
    </div>
  );
}
