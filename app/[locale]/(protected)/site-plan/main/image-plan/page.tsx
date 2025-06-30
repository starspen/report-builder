"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const SiteplanCanvas = dynamic(() => import("./components/siteplan-canvas"), {
  ssr: false,
});
import { PolyUnit, Unit } from "../../interface/unit";

// 📌 Contoh data unit ‒ koordinat berdasar resolusi **ASLI** gambar
const units: Unit[] = [
  {
    id: "LBP_3B",
    x: 843.4760841344818,
    y: 2418.3640457290985,
    width: 629.3371191419991,
    height: 189.95132265407437,
    detailImage: "/images/masterplan_2.jpg",
    status: "sold",
  },
  {
    id: "LBP_3E",
    x: 844.0400482922577,
    y: 2637.9716080587036,
    width: 628.3035661564735,
    height: 166.96952213206396,
    detailImage: "/images/units-3e.png",
    status: "available",
  },
];

export const polygonUnits: PolyUnit[] = [
  {
    id: "LBP_3H",
    points: [
      844.4775260902561, 2831.8396664276784, 849.4247785360586,
      2913.469210581132, 1004.0264174673691, 2913.469210581132,
      1005.2632305788198, 2998.8091885597423, 1466.5945211498508,
      2997.5723772846895, 1467.831334261301, 2830.602855152626,
    ],
    bbox: {
      x: 844.4775260902561,
      y: 2830.602855152626,
      width: 623.3538081710449,
      height: 168.2063334071163,
    },
    detailImage: "/images/units-3h.png",
    status: "available", // "available", "reserved", "sold"
  },
];

export default function SiteplanPage() {
  const [canvasWidth, setCanvasWidth] = useState(800); // default
  const canvasHeight = 600; // boleh proporsional
  const [drawMode, setDrawMode] = useState(false); // ✅ state baru
  const [polygon, setPolygon] = useState(false); // ✅ state baru

  useEffect(() => {
    // Responsif lebar stage
    const update = () => setCanvasWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <main style={{ overflowX: "hidden" }}>
      {/* <h1 style={{ textAlign: "center" }}>Siteplan Viewer</h1> */}
      {/* <div className="border rounded-xl mt-4 p-2">
        <Button
          onClick={() => setDrawMode((v) => !v)}
          variant="ghost"
          className="hover:bg-blue-300 hover:cursor-pointer"
        >
          {drawMode ? "Stop Drawing" : <Square />}
        </Button>
        <Button
          onClick={() => setPolygon((x) => !x)}
          variant="ghost"
          className="hover:bg-blue-300 hover:cursor-pointer"
        >
          {polygon ? "Stop Drawing" : <Pen />}
        </Button>
      </div> */}

      <SiteplanCanvas
        units={units}
        backgroundSrc="/images/masterplan_1.jpg"
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        drawMode={drawMode}
        polygonMode={polygon}
        polygonUnits={polygonUnits}
        onPolygonFinish={() => setPolygon(false)}
      />
    </main>
  );
}
