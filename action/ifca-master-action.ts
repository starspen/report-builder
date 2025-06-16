"use server";

// Interface untuk CF Division
export interface CFDivisionMaster {
  div_cd: string;
  descs: string;
  audit_user: string;
  audit_date: string;
  rowID: string;
}

// Interface untuk CF Staff
export interface CFStaffMaster {
  staff_id: string;
  staff_name: string;
  audit_user: string;
  audit_date: string;
  dept_cd: string;
  div_cd: string;
  agent_type_cd: string;
  rowID: string;
  nik_id: string;
  control_acct: string;
  account_no: string;
  account_name: string;
  email_addr: string;
}

// Interface untuk CF Department
export interface CFDepartmentMaster {
  dept_cd: string;
  descs: string;
  audit_user: string;
  audit_date: string;
  rowID: string;
  name: string;
}


export interface TrxTypeMaster {
  trx_type: string;
  trx_type_desc: string;
}

export interface TaxCodeMaster {
  scheme_cd: string;
  descs: string;
  incl_excl: string;
  rowID: string;
}

export interface CurrencyMaster {
  currency_cd: string;
  descs: string;
  base_currency: string;
  foreign_currency: string;
  audit_user: string;
  audit_date: string;
  rowID: string;
}

// Interface untuk response
export interface CFMasterResponse<T> {
  statusCode: number;
  message: string;
  data: T[];
}

// GET - Mengambil semua data CF Division
export const getCFDivisionMaster = async (): Promise<
  CFMasterResponse<CFDivisionMaster>
> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/ifca-master/cf-div-master`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error fetching CF Division Master:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal mengambil data divisi",
    );
  }
};

// GET - Mengambil semua data CF Staff
export const getCFStaffMaster = async (): Promise<
  CFMasterResponse<CFStaffMaster>
> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/ifca-master/cf-staff-master`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error fetching CF Staff Master:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal mengambil data staff",
    );
  }
};

// GET - Mengambil data CF Staff untuk Labour (yang belum ada di sv_labour)
export const getCFStaffForLabour = async (): Promise<
  CFMasterResponse<CFStaffMaster>
> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/ifca-master/cf-staff-master-for-labour`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error fetching CF Staff for Labour:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Gagal mengambil data staff untuk labour",
    );
  }
};

// GET - Mengambil semua data CF Department
export const getCFDepartmentMaster = async (): Promise<
  CFMasterResponse<CFDepartmentMaster>
> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/ifca-master/cf-dept-master`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error fetching CF Department Master:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Gagal mengambil data departemen",
    );
  }
};

export const getTaxCodeMaster = async (): Promise<
  CFMasterResponse<TaxCodeMaster>
> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/ifca-master/cf-tax-code`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error fetching CF Tax Code Master:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal mengambil data tax code",
    );
  }
};

export const getTrxTypeMaster = async (): Promise<
  CFMasterResponse<TrxTypeMaster>
> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/ifca-master/cf-trx-type`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error fetching CF Trx Type Master:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal mengambil data trx type",
    );
  }
};

export const getCurrencyMaster = async (): Promise<
  CFMasterResponse<CurrencyMaster>
> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/ifca-master/cf-currency`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error fetching CF Currency Master:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal mengambil data currency",
    );
  }
};
