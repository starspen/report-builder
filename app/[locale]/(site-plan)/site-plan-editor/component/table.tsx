"use client";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Group, Rect, Text, Transformer } from "react-konva";

export type AlignItems = "center" | "left" | "right";

export interface TableMeta {
  x: number;
  y: number;
  width: number;
  height: number;
  colWidths: number[];
  rowHeights: number[];
  data: Array<Record<string, any>>;
  alignItems: Record<string, AlignItems>;
}

export interface TableProps {
  x: number;
  y: number;
  data?: Array<Record<string, any>>;
  width: number;
  height?: number;
  isSelected?: boolean;
  onChange?: (meta: TableMeta) => void;
  onClick?: (e: any) => void;
  id?: string;
  stageRef?: React.RefObject<any>;
  onCellClick?: (
    row: number,
    col: number,
    x: number,
    y: number,
    value: string
  ) => void;
  selectedColIndex: number | null;
  alignItems: Record<string, AlignItems>;
  setSelectedColIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setAlignItems: React.Dispatch<
    React.SetStateAction<Record<number, AlignItems>>
  >;
  selectedCell: { row: number; col: number } | null;
  setSelectedCell: React.Dispatch<
    React.SetStateAction<{ row: number; col: number } | null>
  >;
  rectName: string;
  textName: string;
}

const Table = forwardRef<any, TableProps>((props, ref) => {
  const {
    id,
    x,
    y,
    data,
    width,
    height,
    isSelected,
    onChange,
    onClick,
    onCellClick,
    selectedColIndex,
    alignItems,
    setSelectedColIndex,
    setAlignItems,
    selectedCell,
    setSelectedCell,
    rectName,
    textName,
    stageRef,
  } = props;

  const groupRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  // Default columns/rows fallback
  const fallbackCols = 3;
  const fallbackRows = 3;

  const columns =
    data && data.length > 0
      ? Object.keys(data[0])
      : Array.from({ length: fallbackCols }, (_, i) => `col${i + 1}`);
  const totalRows = data ? data.length : fallbackRows;

  const [colWidths, setColWidths] = useState<number[]>(
    columns.map(() => width / columns.length)
  );
  const [rowHeights, setRowHeights] = useState<number[]>(
    new Array(totalRows).fill(30)
  );

  useImperativeHandle(ref, () => groupRef.current);

  // For Transformer
  useEffect(() => {
    if (isSelected && trRef.current && groupRef.current) {
      trRef.current.nodes([groupRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  // --- Table Dimensi
  const tableWidth = colWidths.reduce((a, b) => a + b, 0);
  const tableHeight = rowHeights.reduce((a, b) => a + b, 0);

  // --- Sync Data
  useEffect(() => {
    // Sinkron baris
    if (data && data.length !== rowHeights.length) {
      setRowHeights((prev) => {
        const newHeights = [...prev];
        while (newHeights.length < data.length) newHeights.push(30);
        return newHeights.slice(0, data.length);
      });
    }
    // Sinkron kolom
    if (data && data[0]) {
      const currentCols = Object.keys(data[0]).length;
      if (currentCols !== colWidths.length) {
        setColWidths((prev) => {
          const newWidths = [...prev];
          while (newWidths.length < currentCols)
            newWidths.push(width / currentCols);
          return newWidths.slice(0, currentCols);
        });
      }
    }
  }, [data]);

  // --- PENTING: Kirim semua meta ke parent setiap ada perubahan
  useEffect(() => {
    onChange?.({
      x,
      y,
      width: tableWidth,
      height: tableHeight,
      colWidths,
      rowHeights,
      data: data || [],
      alignItems,
    });
    // eslint-disable-next-line
  }, [x, y, tableWidth, tableHeight, colWidths, rowHeights, data, alignItems]);

  // --- Rendering Table
  const yPos: number[] = rowHeights.reduce(
    (acc, height) => {
      acc.push((acc.at(-1) ?? 0) + height);
      return acc;
    },
    [0]
  );

  return (
    <>
      <Group
        id={id}
        x={x}
        y={y}
        ref={groupRef}
        draggable
        onDragEnd={(e) => {
          onChange?.({
            x: e.target.x(),
            y: e.target.y(),
            width: tableWidth,
            height: tableHeight,
            colWidths,
            rowHeights,
            data: data || [],
            alignItems,
          });
        }}
        onClick={onClick}
      >
        {/* --- CELL & TEXT --- */}
        <Group name="cell-group">
          {Array.from({ length: totalRows }).map((_, rowIndex) => {
            const yOffset = rowHeights
              .slice(0, rowIndex)
              .reduce((a, b) => a + b, 0);
            return columns.map((col, colIndex) => {
              const xOffset = colWidths
                .slice(0, colIndex)
                .reduce((a, b) => a + b, 0);
              const cellValue = data?.[rowIndex]?.[col] ?? "";

              const cellKey = `${rowIndex}-${colIndex}`;
              const textAlign: AlignItems = alignItems[cellKey] ?? "left";

              let textX = xOffset;
              if (textAlign === "center") {
                textX = xOffset + colWidths[colIndex] / 2;
              } else if (textAlign === "right") {
                textX = xOffset + colWidths[colIndex] - 46;
              } else {
                textX = xOffset + 4;
              }

              const isSelected =
                selectedCell?.row === rowIndex &&
                selectedCell?.col === colIndex;

              return (
                <Group key={`cell-${rowIndex}-${colIndex}`}>
                  <Rect
                    name={rectName}
                    x={xOffset}
                    y={yPos[rowIndex]}
                    width={colWidths[colIndex]}
                    height={rowHeights[rowIndex]}
                    stroke={isSelected ? "red" : "#000"}
                    strokeWidth={isSelected ? 2 : 1}
                    onDblClick={() => {
                      setSelectedCell({ row: rowIndex, col: colIndex });
                      onCellClick?.(
                        rowIndex,
                        colIndex,
                        xOffset,
                        yPos[rowIndex],
                        cellValue
                      );
                    }}
                  />
                  <Text
                    name={textName}
                    x={textX}
                    y={yPos[rowIndex] + 8}
                    width={colWidths[colIndex] - 10}
                    height={rowHeights[rowIndex] - 10}
                    fontSize={13}
                    text={cellValue}
                    fill="#333"
                    onClick={() => {
                      setSelectedCell({ row: rowIndex, col: colIndex });
                    }}
                    onDblClick={() =>
                      onCellClick?.(
                        rowIndex,
                        colIndex,
                        xOffset,
                        yPos[rowIndex],
                        cellValue
                      )
                    }
                  />
                </Group>
              );
            });
          })}
        </Group>

        {/* --- RESIZE HANDLES --- */}
        <Group name="resize-handles" listening={true}>
          {/* VERTICAL HANDLE DI ANTAR KOLOM */}
          {colWidths.map((_, colIndex) => {
            const xOffset = colWidths
              .slice(0, colIndex + 1)
              .reduce((a, b) => a + b, 0);

            return (
              <Rect
                key={`col-resize-${colIndex}`}
                x={xOffset}
                y={0}
                width={1}
                height={tableHeight}
                fill="black"
                draggable
                name="resize-handle-vertical"
                dragBoundFunc={(pos) => ({
                  x: pos.x,
                  y: 0,
                })}
                onMouseEnter={() => {
                  if (stageRef?.current) {
                    (stageRef.current.container() as HTMLDivElement).style.cursor =
                      "col-resize";
                  }
                }}
                onMouseLeave={() => {
                  if (stageRef?.current) {
                    (stageRef.current.container() as HTMLDivElement).style.cursor =
                      "default";
                  }
                }}
                onDragEnd={(e) => {
                  const newX = e.target.x() - x;
                  const prevX = colWidths
                    .slice(0, colIndex)
                    .reduce((a, b) => a + b, 0);
                  const delta = newX - prevX;

                  const newWidths = [...colWidths];
                  newWidths[colIndex] = Math.max(30, delta);
                  setColWidths(newWidths);

                  onChange?.({
                    x,
                    y,
                    width: newWidths.reduce((a, b) => a + b, 0),
                    height: tableHeight,
                    colWidths: newWidths,
                    rowHeights,
                    data: data || [],
                    alignItems,
                  });
                }}
              />
            );
          })}

          {/* HORIZONTAL HANDLE DI ANTAR BARIS */}
          {rowHeights.map((_, rowIndex) => {
            const yOffset = rowHeights
              .slice(0, rowIndex + 1)
              .reduce((a, b) => a + b, 0);

            return (
              <Rect
                key={`row-resize-${rowIndex}`}
                x={0}
                y={yOffset}
                width={tableWidth}
                height={1}
                fill="black"
                draggable
                name="resize-handle-horizontal"
                dragBoundFunc={(pos) => ({
                  x: 0,
                  y: pos.y,
                })}
                onMouseEnter={() => {
                  if (stageRef?.current) {
                    (stageRef.current.container() as HTMLDivElement).style.cursor =
                      "row-resize";
                  }
                }}
                onMouseLeave={() => {
                  if (stageRef?.current) {
                    (stageRef.current.container() as HTMLDivElement).style.cursor =
                      "default";
                  }
                }}
                onDragEnd={(e) => {
                  const newY = e.target.y();
                  const prevY = rowHeights
                    .slice(0, rowIndex)
                    .reduce((a, b) => a + b, 0);
                  const delta = newY - prevY;

                  const newHeights = [...rowHeights];
                  newHeights[rowIndex] = Math.max(20, delta);
                  setRowHeights(newHeights);

                  onChange?.({
                    x,
                    y,
                    width: tableWidth,
                    height: newHeights.reduce((a, b) => a + b, 0),
                    colWidths,
                    rowHeights: newHeights,
                    data: data || [],
                    alignItems,
                  });
                }}
              />
            );
          })}
        </Group>
      </Group>

      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 100 || newBox.height < 30) return oldBox;
            return newBox;
          }}
        />
      )}
    </>
  );
});

export default Table;
