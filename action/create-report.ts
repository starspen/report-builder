export interface CreateReportPayload {
  company_cd: string
  entity_cd: string;
  project_no: string;
  name: string;
  audit_user: string;
  document_id: string;
}

export const createReport = async (payload: CreateReportPayload) => {
  const mode = process.env.NEXT_PUBLIC_ENV_MODE;
  const baseUrl =
    mode === "sandbox"
      ? process.env.NEXT_PUBLIC_API_BACKEND_SANDBOX_URL
      : process.env.NEXT_PUBLIC_API_BACKEND_PRODUCTION_URL;

  console.log("mode:", mode);
  console.log("baseUrl:", baseUrl);

  if (!baseUrl) {
    throw new Error("API base URL is not defined");
  }

  const response = await fetch(`${baseUrl}/api/template/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to create masterplan: ${err}`);
  }

  const json = await response.json();
  return json;
};
