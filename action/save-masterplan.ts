export interface SaveMasterplanPayload {
  id?: number;
  entity_cd: string;
  project_no: string;
  masterplan_name: string;
  audit_user: string;
  artboards: {
    id: number | string;
    title: string;
    type?: string;
    shapes: any[];
  }[];
}

export const saveMasterplan = async (payload: SaveMasterplanPayload) => {
  const mode = process.env.NEXT_PUBLIC_ENV_MODE;
  const baseUrl =
    mode === "sandbox"
      ? process.env.NEXT_PUBLIC_API_BACKEND_SANDBOX_URL
      : process.env.NEXT_PUBLIC_API_BACKEND_PRODUCTION_URL;

  if (!baseUrl) {
    throw new Error("API base URL is not defined");
  }

  const response = await fetch(`${baseUrl}/api/masterplan/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to save masterplan: ${err}`);
  }

  const json = await response.json();
  return json;
};
