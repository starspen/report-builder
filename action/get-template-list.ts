// lib/api/entity/get-entities.client.ts
export interface templateList {
  id: string;
  name: string;
  entity_cd: string;
  company_cd: string;
  document_id: string;
  audit_user: string;
  audit_date: string;
}

export const getTemplateList = async (
  entity_cd: string,
) => {
  const mode = process.env.NEXT_PUBLIC_ENV_MODE;
  const baseUrl =
    mode === "sandbox"
      ? process.env.NEXT_PUBLIC_API_BACKEND_SANDBOX_URL
      : process.env.NEXT_PUBLIC_API_BACKEND_PRODUCTION_URL;

  const url = new URL(`${baseUrl}/api/template/list/${entity_cd}`);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to fetch masterplan data: ${err}`);
  }

  const json = await response.json();
  return json.data;
};