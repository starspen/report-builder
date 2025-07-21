import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  id: string;
  children: React.ReactNode;
}

const SortableMenuItem: React.FC<Props> = ({ id, children }) => {
  const {
    setNodeRef,
    transform,
    transition,
    isDragging,
    attributes,
    listeners,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    width: "100%", // ✅ ini penting!
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-start group">
      {/* Drag Handle only */}
      <div
        {...attributes}
        {...listeners}
        className="sortable-wrapper flex items-center mt-2 ml-2"
        title="Drag"
      >
        {/* Drag Icon */}
        <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
          <circle cx="4" cy="5" r="1.5" />
          <circle cx="4" cy="10" r="1.5" />
          <circle cx="4" cy="15" r="1.5" />
          <circle cx="10" cy="5" r="1.5" />
          <circle cx="10" cy="10" r="1.5" />
          <circle cx="10" cy="15" r="1.5" />
        </svg>
      </div>

      {/* Content (clickable, collapsible, rename-able) */}
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default SortableMenuItem;
