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

export interface TrxTypeICMaster {
  trx_type: string;
  descs: string;
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

export interface EntityMaster {
  entity_cd: string;
  entity_name: string;
  bs_div?: string;
  bs_dept?: string;
  base_currency?: string;
  posttransl?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  post_cd?: string;
  telephone_no?: string;
  fax_no?: string;
  tax_descs?: string;
  tax_reg_no?: string;
  balentity?: string;
  fyear?: number;
  aperiod?: number;
  ver_cd?: string;
  audit_user: string;
  audit_date: string;
  budget_ctrl?: string;
  budget_acct_dept?: string;
  rowID: number;
  logo1?: string;
  tax_reg_cd?: string;
  head_of_combine?: string;
  combine_to_entity?: string;
  va_bca_cd?: string;
  company_name?: string;
  project_name?: string;
  virtual_cd?: string;
  va_days?: number;
  va_bca_cd_sales?: string;
  check_budget?: string;
}

export interface ProjectMaster {
  entity_cd: string;
  project_no: string;
  project_date?: string;
  project_ref?: string;
  debtor_acct?: string;
  debtor_type?: string;
  owner_type?: string;
  location?: string;
  project_type?: string;
  descs?: string;
  award_date?: string;
  start_date?: string;
  completion_date?: string;
  currency_cd: string;
  contract_amt: number;
  auth_vo: number;
  claim_todate: number;
  ret_todate: number;
  ret_limit: number;
  ret_percent: number;
  max_ret_percent?: number;
  ret_release_date?: string;
  penalty: number;
  min_claim_amt?: number;
  claim_interval?: number;
  ret_acct?: string;
  profit_acct?: string;
  wip_acct?: string;
  revenue_acct?: string;
  memo_acct?: string;
  project_rev_cd?: string;
  ret_cd?: string;
  memo_cd?: string;
  est_cost?: number;
  prev_recog_profit?: number;
  project_status?: string;
  remarks?: string;
  audit_user: string;
  audit_date: string;
  project_factor?: number;
  doc_no?: number;
  claim_method?: string;
  act_complete_dt?: string;
  last_bill_date?: string;
  div_cd?: string;
  dept_cd?: string;
  activity_cd?: string;
  wstatus?: string;
  contact_person?: string;
  contact_telno?: string;
  contact_email?: string;
  designation?: string;
  post_sch_flag?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  post_cd?: string;
  payment_cd?: string;
  const_sch?: string;
  selling_price?: number;
  pay_bank_cd?: string;
  duration?: number;
  project_group?: string;
  RowID: number;
  calendar?: string;
  default_bank_code?: string;
  financier_type?: string;
  solicitor_type?: string;
  debtor_no?: number;
  approval_status?: string;
  contact_person2?: string;
  designation2?: string;
  estimate_amt?: number;
  remarks_1?: string;
  remarks_sp?: string;
  MONTH?: number;
  YEAR?: number;
  email_add?: string;
  remarks_sa?: string;
  propose_start_date?: string;
  propose_end_date?: string;
  submit?: string;
  budget_status?: string;
  no_rek?: string;
}

export interface DocTypeMaster {
  prefix: string;
  entity_cd: string;
  descs: string;
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

export const getTrxTypeICMaster = async (): Promise<
  CFMasterResponse<TrxTypeICMaster>
> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/ifca-master/cf-trx-type-ic`,
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
    console.error("Error fetching CF Trx Type IC Master:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal mengambil data trx type ic",
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


export const getEntityMaster = async (): Promise<
  CFMasterResponse<EntityMaster>
> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/ifca-master/cf-entity`,
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

export const getProjectMaster = async (): Promise<
  CFMasterResponse<ProjectMaster>
> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/ifca-master/pl-project`,
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
    console.error("Error fetching CF Project Master:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Gagal mengambil data departemen",
    );
  }
};

export const getDocTypeforCS = async (entity_cd: string): Promise<
  CFMasterResponse<DocTypeMaster>
> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/ifca-master/cf-document-ctl/doc-type/${entity_cd}`,
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
    console.error("Error fetching CF Doc Type Master:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal mengambil data doc type",
    );
  }
};

export const getDocTypeTenantforCS = async (entity_cd: string): Promise<
  CFMasterResponse<DocTypeMaster>
> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/ifca-master/cf-document-ctl/doc-type-tenant/${entity_cd}`,
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
    console.error("Error fetching CF Doc Type Master:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal mengambil data doc type",
    );
  }


};