// File: types/master-data.ts

export interface City {
  descs: string;
  cd: string;
}

export interface Religion {
  cd: string;
  descs: string;
}
export interface Gender {
  cd: string;
  descs: string;
}

export interface Term {
  cd: string;
  descs: string;
  days: number;
}
export interface TaxTrx {
  cd: string;
  descs: string;
}
export interface Occupation {
  cd: string;
  descs: string;
}
export interface OccupationDt {
  cd: string;
  descs: string;
}

export interface ClassOption {
  entity_cd: string;
  class_cd: string;
}

export interface Currency {
  cd: string;
  descs: string;
}

export interface MasterDataResponse {
  city: City[];
  religion: Religion[];
  term: Term[];
  classOptions: ClassOption[];
  currency: Currency[];
  taxTrx: TaxTrx[];
  occupation: Occupation[];
  occupationDt: OccupationDt[];
  gender: Gender[];
}

export interface JsonResponse {
  statusCode: number;
  message: string;
  data: MasterDataResponse;
}

export const getMasterData = async (): Promise<JsonResponse["data"]> => {
  const mode = process.env.NEXT_PUBLIC_ENV_MODE;
  const baseUrl =
    mode === "sandbox"
      ? process.env.NEXT_PUBLIC_API_BACKEND_SANDBOX_URL
      : process.env.NEXT_PUBLIC_API_BACKEND_PRODUCTION_URL;

  const url = new URL(`${baseUrl}/api/booking/options`);

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
