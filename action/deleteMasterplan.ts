export const deleteMasterplan = async (id: string | number) => {
  const mode = process.env.NEXT_PUBLIC_ENV_MODE;
  const baseUrl =
    mode === "sandbox"
      ? process.env.NEXT_PUBLIC_API_BACKEND_SANDBOX_URL
      : process.env.NEXT_PUBLIC_API_BACKEND_PRODUCTION_URL;

  if (!baseUrl) {
    throw new Error("API base URL is not defined");
  }

  const response = await fetch(`${baseUrl}/api/masterplan/delete/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to delete masterplan: ${err}`);
  }

  // Cek apakah response ada isinya dulu
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
};
