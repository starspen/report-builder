export interface Unit {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  detailImage: string;
  status?: string;
}

export interface PolyUnit {
  id: string;
  points: number[];
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  detailImage: string;
  status: string;
}

export interface UnitsDetail {
  id: string;
  code: string;
  blockId: string;
  status: string; // "available", "reserved", "sold"
  detailImage: string;
  x: number;
  y: number;
  width: number;
  height: number;
  terrace: string;
  livingRoom: string;
  bath: string;
  hallway: string;
  bedroom: string;
  backGarden: string;
  garage: string;
  price: string;
}

export interface LotDetail {
  id: string; // "A1-01"
  code: string; // kode marketing
  type: string; // “Standard”, “Hook”, dst.
  price: number; // contoh: 750_000_000
  size: number; // luas m²
}
