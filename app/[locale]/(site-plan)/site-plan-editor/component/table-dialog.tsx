"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DrawMode } from "./canvas";
import Table, { AlignItems } from "./table";
import { Layer, Stage } from "react-konva";

// 👇 helper untuk generate data kosong
function generateEmptyTableData(
  rows: number,
  columns: number
): Array<Record<string, any>> {
  const data: Array<Record<string, any>> = [];
  for (let i = 0; i < rows; i++) {
    const row: Record<string, any> = {};
    for (let j = 0; j < columns; j++) {
      row[`col${j + 1}`] = ""; // bisa diisi default value lain
    }
    data.push(row);
  }
  return data;
}

export type TableRow = Record<string, any>; // atau lebih spesifik: Record<string, string>

interface TableDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setMode: React.Dispatch<React.SetStateAction<DrawMode>>;
  mode?: DrawMode;
  tableData: TableRow[] | undefined;
  setTableData: React.Dispatch<React.SetStateAction<TableRow[] | undefined>>;
}

const TableDialog = ({
  open,
  setOpen,
  setMode,
  tableData,
  setTableData,
}: TableDialogProps) => {
  const stageRef = useRef<any>(null);
  const [rows, setRows] = useState(2);
  const [columns, setColumns] = useState(2);

  const [tableOffset, setTableOffset] = useState({ x: 0, y: 0 });
  const [selectedColIndex, setSelectedColIndex] = useState<number | null>(null);
  const [alignItems, setAlignItems] = useState<Record<string, AlignItems>>({});
  const [tableMeta, setTableMeta] = useState<any>(null);
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const [editingCell, setEditingCell] = useState<{
    row: number;
    col: number;
    x: number;
    y: number;
    value: string;
  } | null>(null);

  const rectName = "cell-rect";
  const textName = "cell-text";

  function handleSaveEditingCell(valueFromInput: string) {
    if (!editingCell || !tableData) return;

    const updated = [...tableData];
    const key = Object.keys(updated[0])[editingCell.col];
    updated[editingCell.row][key] = valueFromInput;
    setTableData(updated);
    setEditingCell(null);
  }

  const handleSubmit = () => {
    if (!tableMeta || !tableData) return;

    const {
      x: tableX,
      y: tableY,
      colWidths,
      rowHeights,
      alignItems,
    } = tableMeta;
    const columns =
      tableData && tableData.length > 0 ? Object.keys(tableData[0]) : [];

    // Hitung posisi cell
    const yPos = rowHeights.reduce(
      (acc: any, h: any) => {
        acc.push((acc.at(-1) ?? 0) + h);
        return acc;
      },
      [0]
    );
    const xPos = colWidths.reduce(
      (acc: any, w: any) => {
        acc.push((acc.at(-1) ?? 0) + w);
        return acc;
      },
      [0]
    );

    const cells = [];
    for (let row = 0; row < rowHeights.length; row++) {
      for (let col = 0; col < colWidths.length; col++) {
        cells.push({
          x: tableX + xPos[col],
          y: tableY + yPos[row],
          width: colWidths[col],
          height: rowHeights[row],
          value: tableData[row][columns[col]],
          align: alignItems[`${row}-${col}`] ?? "left",
        });
      }
    }

    // Sekarang kamu punya meta tabel + cells ABSOLUTE:
    const submitPayload = {
      ...tableMeta, // x, y, width, height, colWidths, rowHeights, data, alignItems
      cells, // <--- POSISI ABSOLUT CELL!
    };

    // Kirim atau console.log(submitPayload)
    console.log(submitPayload, "PAYLOAD UNTUK SUBMIT");

    // TODO: dispatch ke API, redux, dsb
  };

  useEffect(() => {
    const newData = generateEmptyTableData(rows, columns);
    setTableData(newData);
  }, [rows, columns]);

  useEffect(() => {
    console.log("Updated tableData:", tableData);
  }, [tableData]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[700px]" size="5xl">
        <DialogHeader>
          <DialogTitle>Buat Tabel</DialogTitle>
          <DialogDescription>
            Masukkan jumlah baris dan kolom yang ingin kamu buat.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="rows">Jumlah Baris</Label>
            <Input
              id="rows"
              type="number"
              min={1}
              value={rows}
              onChange={(e) => setRows(Number(e.target.value))}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="columns">Jumlah Kolom</Label>
            <Input
              id="columns"
              type="number"
              min={1}
              value={columns}
              onChange={(e) => setColumns(Number(e.target.value))}
            />
          </div>
        </div>

        {selectedCell !== null && (
          <div className="flex gap-2">
            <Button
              onClick={() =>
                setAlignItems((prev) => ({
                  ...prev,
                  [`${selectedCell.row}-${selectedCell.col}`]: "left",
                }))
              }
            >
              Align Left
            </Button>
            <Button
              onClick={() =>
                setAlignItems((prev) => ({
                  ...prev,
                  [`${selectedCell.row}-${selectedCell.col}`]: "center",
                }))
              }
            >
              Align Center
            </Button>
            <Button
              onClick={() =>
                setAlignItems((prev) => ({
                  ...prev,
                  [`${selectedCell.row}-${selectedCell.col}`]: "right",
                }))
              }
            >
              Align Right
            </Button>
          </div>
        )}

        {/* Render Table di dalam dialog */}
        {/* Render Table di dalam dialog */}
        <div className="relative border mt-4 p-2">
          <Stage
            ref={stageRef}
            width={900}
            height={300}
            onMouseDown={(e) => {
              const name = e.target?.name?.();
              if (name !== "cell-rect" && name !== "cell-text") {
                setSelectedCell(null); // reset selection jika klik di luar cell
              }
            }}
          >
            <Layer>
              {tableData && (
                <Table
                  key={`table-${rows}-${columns}`}
                  id="preview"
                  x={0}
                  y={0}
                  width={500}
                  data={tableData}
                  onChange={(meta) => {
                    setTableMeta(meta);
                    setTableOffset({ x: meta.x, y: meta.y }); // opsional, kalau pakai offset
                  }}
                  onCellClick={(row, col, x, y, value) => {
                    if (
                      !tableData ||
                      tableData.length !== rows ||
                      Object.keys(tableData[0]).length !== columns
                    ) {
                      const newData = generateEmptyTableData(rows, columns);
                      setTableData(newData);
                      value = newData[row][`col${col + 1}`] ?? "";
                    }

                    setEditingCell({ row, col, x, y, value });
                  }}
                  selectedColIndex={selectedColIndex}
                  alignItems={alignItems}
                  setSelectedColIndex={setSelectedColIndex}
                  setAlignItems={setAlignItems}
                  selectedCell={selectedCell}
                  setSelectedCell={setSelectedCell}
                  rectName={rectName}
                  textName={textName}
                  stageRef={stageRef}
                />
              )}
            </Layer>
          </Stage>

          {/* ✅ input HTML tidak boleh di dalam <Stage> */}
          {editingCell && (
            <>
              {console.log("INPUT at", {
                left: tableOffset.x + editingCell.x,
                top: tableOffset.y + editingCell.y,
                editingCell,
                tableOffset,
              })}
              <input
                type="text"
                value={editingCell.value}
                style={{
                  position: "absolute",
                  top: tableOffset.y + editingCell.y, // 65 = offset layout dialog
                  left: tableOffset.x + editingCell.x,

                  zIndex: 9999,
                  padding: "4px",
                  fontSize: "13px",
                  border: "1px solid gray",
                  background: "white",
                }}
                onChange={(e) =>
                  setEditingCell((prev) =>
                    prev ? { ...prev, value: e.target.value } : null
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSaveEditingCell((e.target as HTMLInputElement).value);
                  }
                }}
                onBlur={(e) => {
                  handleSaveEditingCell((e.target as HTMLInputElement).value);
                }}
                autoFocus
              />
            </>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setMode("default");
                setOpen(false);
                setTableData(undefined);
              }}
            >
              Batal
            </Button>
          </DialogClose>

          {/* Tidak close, hanya generate preview */}
          <Button
            type="submit"
            onClick={() => {
              handleSubmit();
            }}
          >
            Submit Tabel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TableDialog;
