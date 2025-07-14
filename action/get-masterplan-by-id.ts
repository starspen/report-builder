export const getMasterplanById = async (id: string) => {
  const mode = process.env.NEXT_PUBLIC_ENV_MODE;
  const baseUrl =
    mode === "sandbox"
      ? process.env.NEXT_PUBLIC_API_BACKEND_SANDBOX_URL
      : process.env.NEXT_PUBLIC_API_BACKEND_PRODUCTION_URL;

  const response = await fetch(`${baseUrl}/api/masterplan/get/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to fetch masterplan by id: ${err}`);
  }

  const json = await response.json();
  return json.data;
};

export const getMasterPlanData = async (
  entity_cd: string,
  project_no: string
) => {
  const mode = process.env.NEXT_PUBLIC_ENV_MODE;
  const baseUrl =
    mode === "sandbox"
      ? process.env.NEXT_PUBLIC_API_BACKEND_SANDBOX_URL
      : process.env.NEXT_PUBLIC_API_BACKEND_PRODUCTION_URL;

  const url = new URL(`${baseUrl}/api/masterplan/get`);
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
    const err = await response.text();
    throw new Error(`Failed to fetch masterplan data: ${err}`);
  }

  const json = await response.json();
  return json.data;
};
