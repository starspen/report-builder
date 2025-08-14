export const getPaperByDocument = async (document: string) => {
  const mode = process.env.NEXT_PUBLIC_ENV_MODE;
  const baseUrl =
    mode === "sandbox"
      ? process.env.NEXT_PUBLIC_API_BACKEND_SANDBOX_URL
      : process.env.NEXT_PUBLIC_API_BACKEND_PRODUCTION_URL;

  const response = await fetch(`${baseUrl}/api/template/get/${document}`, {
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
