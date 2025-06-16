// API Utility Functions untuk Customer Service Master
export interface BaseApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface BaseApiListResponse<T> {
  statusCode: number;
  message: string;
  data: T[];
}

export interface ApiError {
  message: string;
  statusCode?: number;
}

// Generic API Call dengan error handling yang konsisten
export async function apiCall<T>(
  url: string,
  options: RequestInit = {},
  errorContext: string = "API call"
): Promise<T> {
  try {
    const defaultHeaders = {
      "Content-Type": "application/json",
      accept: "*/*",
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`Error ${errorContext}:`, error);
    throw new Error(
      error instanceof Error ? error.message : `Gagal ${errorContext}`
    );
  }
}

// Generic GET request
export async function apiGet<T>(
  endpoint: string,
  errorMessage: string = "mengambil data"
): Promise<T> {
  const url = `${process.env.CS_API_URL}${endpoint}`;
  return apiCall<T>(url, { method: "GET" }, errorMessage);
}

// Generic POST request
export async function apiPost<T, K>(
  endpoint: string,
  data: K,
  errorMessage: string = "menambah data"
): Promise<T> {
  const url = `${process.env.CS_API_URL}${endpoint}`;
  return apiCall<T>(
    url,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    errorMessage
  );
}

// Generic PUT request
export async function apiPut<T, K>(
  endpoint: string,
  data: K,
  errorMessage: string = "mengupdate data"
): Promise<T> {
  const url = `${process.env.CS_API_URL}${endpoint}`;
  return apiCall<T>(
    url,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
    errorMessage
  );
}

// Generic DELETE request
export async function apiDelete<T>(
  endpoint: string,
  errorMessage: string = "menghapus data"
): Promise<T> {
  const url = `${process.env.CS_API_URL}${endpoint}`;
  return apiCall<T>(url, { method: "DELETE" }, errorMessage);
}

// Validation helper
export function validateRequired<T extends Record<string, any>>(
  data: T,
  requiredFields: (keyof T)[]
): string[] {
  const errors: string[] = [];
  
  requiredFields.forEach((field) => {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      errors.push(`${String(field)} is required`);
    }
  });
  
  return errors;
}

// Data transformation helper
export function transformToSelectOptions<T>(
  data: T[],
  valueField: keyof T,
  labelField: keyof T,
  labelFormatter?: (item: T) => string
): Array<{ value: string; label: string }> {
  if (!Array.isArray(data)) return [];
  
  return data.map((item) => ({
    value: String(item[valueField]),
    label: labelFormatter ? labelFormatter(item) : String(item[labelField]),
  }));
} 