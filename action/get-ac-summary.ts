// lib/api/lot-spec.ts

export const getAcSummary = async (
  lot_no: string,
  entity_cd: string,
  project_no: string
) => {
  const mode = process.env.NEXT_PUBLIC_ENV_MODE;
  const baseUrl =
    mode === "sandbox"
      ? process.env.NEXT_PUBLIC_API_BACKEND_SANDBOX_URL
      : process.env.NEXT_PUBLIC_API_BACKEND_PRODUCTION_URL;

  const url = new URL(`${baseUrl}/api/ac/summary`);
  url.searchParams.append("lot_no", lot_no);
  url.searchParams.append("entity_cd", entity_cd);
  url.searchParams.append("project_no", project_no);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("Fetch Error:", errText); // Debug
    throw new Error(`Failed to fetch lot spec: ${errText}`);
  }

  const json = await response.json();

  if (!json?.data) {
    throw new Error("No data returned from API");
  }

  return json.data; // ✅ Return secara eksplisit
};
