// data.ts

export interface PaperSize {
  name: string;
  width: number;
  height: number;
}

export interface FontFamily {
  name: string;
}

export const paperSizes: PaperSize[] = [
  // A Series
  { name: "A0", width: 2383.94, height: 3370.39 },
  { name: "A1", width: 1683.78, height: 2383.94 },
  { name: "A2", width: 1190.55, height: 1683.78 },
  { name: "A3", width: 841.89, height: 1190.55 },
  { name: "A4", width: 595.28, height: 841.89 },
  { name: "A5", width: 419.53, height: 595.28 },
  { name: "A6", width: 297.64, height: 419.53 },
  { name: "A7", width: 209.76, height: 297.64 },
  { name: "A8", width: 147.4, height: 209.76 },
  { name: "A9", width: 104.88, height: 147.4 },
  { name: "A10", width: 73.7, height: 104.88 },

  // B Series
  { name: "B0", width: 2834.65, height: 4008.19 },
  { name: "B1", width: 2004.09, height: 2834.65 },
  { name: "B2", width: 1417.32, height: 2004.09 },
  { name: "B3", width: 1000.63, height: 1417.32 },
  { name: "B4", width: 708.66, height: 1000.63 },
  { name: "B5", width: 498.9, height: 708.66 },
  { name: "B6", width: 354.33, height: 498.9 },
  { name: "B7", width: 249.45, height: 354.33 },
  { name: "B8", width: 175.75, height: 249.45 },
  { name: "B9", width: 124.72, height: 175.75 },
  { name: "B10", width: 87.87, height: 124.72 },

  // C Series
  { name: "C0", width: 2599.37, height: 3676.54 },
  { name: "C1", width: 1836.85, height: 2599.37 },
  { name: "C2", width: 1298.27, height: 1836.85 },
  { name: "C3", width: 918.43, height: 1298.27 },
  { name: "C4", width: 649.13, height: 918.43 },
  { name: "C5", width: 459.21, height: 649.13 },
  { name: "C6", width: 323.15, height: 459.21 },
  { name: "C7", width: 229.61, height: 323.15 },
  { name: "C8", width: 161.57, height: 229.61 },
  { name: "C9", width: 113.39, height: 161.57 },
  { name: "C10", width: 79.37, height: 113.39 },

  // RA Series
  { name: "RA0", width: 2437.8, height: 3458.27 },
  { name: "RA1", width: 1729.13, height: 2437.8 },
  { name: "RA2", width: 1218.9, height: 1729.13 },
  { name: "RA3", width: 864.57, height: 1218.9 },
  { name: "RA4", width: 609.45, height: 864.57 },

  // SRA Series
  { name: "SRA0", width: 2551.18, height: 3628.35 },
  { name: "SRA1", width: 1814.17, height: 2551.18 },
  { name: "SRA2", width: 1275.59, height: 1814.17 },
  { name: "SRA3", width: 907.09, height: 1275.59 },
  { name: "SRA4", width: 637.8, height: 907.09 },

  // North American Sizes
  { name: "EXECUTIVE", width: 521.86, height: 756.0 },
  { name: "LEGAL", width: 612.0, height: 1008.0 },
  { name: "LETTER", width: 612.0, height: 792.0 },
  { name: "TABLOID", width: 792.0, height: 1224.0 },
  { name: "FOLIO", width: 612.0, height: 936.0 },

  // Extra Sizes
  { name: "4A0", width: 4767.89, height: 6740.79 },
  { name: "2A0", width: 3370.39, height: 4767.87 },
];

export const font: FontFamily[] = [
  { name: "Courier" },
  { name: "Courier-Bold" },
  { name: "Courier-Oblique" },
  { name: "Courier-BoldOblique" },
  { name: "Helvetica" },
  { name: "Helvetica-Bold" },
  { name: "Helvetica-Oblique" },
  { name: "Helvetica-BoldOblique" },
  { name: "Symbol" },
  { name: "Times-Roman" },
  { name: "Times-Bold" },
  { name: "Times-Italic" },
  { name: "Times-BoldItalic" },
  { name: "ZapfDingbats" },
];
