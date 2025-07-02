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
  propertyType?: string;
  lotNo?: string;
  description?: string;
  address?: string;
  lotType?: string;
  block?: string;
  zone?: string;
  direction?: string;
  level?: string;
  areaUOM?: string;
  buildUpArea?: string;
  theme?: string;
  class?: string;
  category?: string;
  referenceNo?: string;
  remarks?: string;
}

export interface LotDetail {
  id: string; // "A1-01"
  code: string; // kode marketing
  type: string; // “Standard”, “Hook”, dst.
  price: number; // contoh: 750_000_000
  size: number; // luas m²
}

export interface UnitSalesData {
  id: string;
  debtorAcct: string;
  debtorName: string;
  salesDate: string; // YYYY-MM-DD
  ppjbDate: string; // YYYY-MM-DD
  ajbDate: string; // YYYY-MM-DD
  keyCollectionDate: string; // YYYY-MM-DD
  salesPrice: string; // e.g., "750.000.000"
}

export interface AcSummary {
  id: string;
  unitId: string;
  invoice: number;
  interest: number;
  debitNote: number;
  tax: number;
  creditNote: number;
  receipt: number;
  forex: number;
  balance: number;
  deposit: number;
}

export interface ScheduleBilling {
  id: string;
  unitId: string;
  billDate: string;
  type: string;
  trx: string;
  description: string;
  forex: string;
  trxAmount: number;
}
