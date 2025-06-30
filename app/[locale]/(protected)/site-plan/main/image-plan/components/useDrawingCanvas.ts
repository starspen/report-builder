import { useState, useRef, useEffect } from "react";
import { Unit, PolyUnit } from "../../../interface/unit";

export const useDrawingCanvas = (
  initialUnits: Unit[],
  initialPolys: PolyUnit[]
) => {
  const [drawnUnits, setDrawnUnits] = useState<Unit[]>(initialUnits);
  const [drawnPolygonUnits, setDrawnPolygonUnits] =
    useState<PolyUnit[]>(initialPolys);
  const [currentPolyPoints, setCurrentPolyPoints] = useState<number[]>([]);
  const [tempRect, setTempRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const historyStack = useRef<{ units: Unit[]; polys: PolyUnit[] }[]>([]);
  const redoStack = useRef<{ units: Unit[]; polys: PolyUnit[] }[]>([]);

  const snapshot = () => ({
    units: JSON.parse(JSON.stringify(drawnUnits)),
    polys: JSON.parse(JSON.stringify(drawnPolygonUnits)),
  });

  const pushSnapshot = () => {
    historyStack.current.push(snapshot());
    redoStack.current = [];
    if (historyStack.current.length > 50) historyStack.current.shift();
  };

  const undo = () => {
    if (historyStack.current.length === 0) return;
    const prev = historyStack.current.pop()!;
    redoStack.current.push(snapshot());
    setDrawnUnits(prev.units);
    setDrawnPolygonUnits(prev.polys);
  };

  const redo = () => {
    if (redoStack.current.length === 0) return;
    const next = redoStack.current.pop()!;
    historyStack.current.push(snapshot());
    setDrawnUnits(next.units);
    setDrawnPolygonUnits(next.polys);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "y" || (e.key === "z" && e.shiftKey))
      ) {
        e.preventDefault();
        redo();
      }
      if (e.key === "Delete" && selectedId) {
        setDrawnPolygonUnits((prev) => prev.filter((p) => p.id !== selectedId));
        setDrawnUnits((prev) => prev.filter((r) => r.id !== selectedId));
        setSelectedId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId]);

  return {
    drawnUnits,
    setDrawnUnits,
    drawnPolygonUnits,
    setDrawnPolygonUnits,
    currentPolyPoints,
    setCurrentPolyPoints,
    tempRect,
    setTempRect,
    startPos,
    setStartPos,
    selectedId,
    setSelectedId,
    pushSnapshot,
    undo,
    redo,
  };
};
