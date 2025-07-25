// File: types/master-data.ts

export interface City {
  district: string;
  city: string;
}

export interface Params {
  page: number;
  limit: number;
  search: string;
}

export interface MasterDataResponse {
  city: City[];
  params: Params;
}

export interface JsonResponse {
  statusCode: number;
  message: string;
  data: City[]; // sebelumnya: MasterDataResponse
}

export const getCityData = async (
  page: string,
  limit: any,
  search?: string
): Promise<JsonResponse["data"]> => {
  const mode = process.env.NEXT_PUBLIC_ENV_MODE;
  const baseUrl =
    mode === "sandbox"
      ? process.env.NEXT_PUBLIC_API_BACKEND_SANDBOX_URL
      : process.env.NEXT_PUBLIC_API_BACKEND_PRODUCTION_URL;

  const validPage = Math.max(Number(page) || 1, 1).toString();
  const validLimit = Math.max(Number(limit) || 10, 10).toString();

  const url = new URL(`${baseUrl}/api/city/options`);
  url.searchParams.append("page", validPage);
  url.searchParams.append("limit", validLimit);
  url.searchParams.append("search", search || "");

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to fetch master data: ${err}`);
  }

  const json: JsonResponse = await response.json();
  return json.data;
};
