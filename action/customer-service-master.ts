"use server";

// ------------------------------------------------------------
// SECTION MASTER
// ------------------------------------------------------------

export interface CSMasterSectionResponse {
  statusCode: number;
  message: string;
  data: CSMasterSection[];
}

export interface CSMasterSectionSingleResponse {
  statusCode: number;
  message: string;
  data: CSMasterSection;
}

export interface CSMasterSectionCreateRequest {
  section_cd: string;
  descs: string;
  audit_user: string;
}

export interface CSMasterSectionUpdateRequest {
  section_cd: string;
  descs: string;
  audit_user: string;
}

export interface CSMasterSection {
  section_cd: string;
  descs: string;
  audit_user: string;
  audit_date: string;
  rowID: string;
}

export const getCSMasterSection =
  async (): Promise<CSMasterSectionResponse> => {
    try {
      const response = await fetch(
        `${process.env.CS_API_URL}/customer-service/cs-master/section`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`,
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching CS Master Section:", error);
      throw new Error(
        error instanceof Error ? error.message : "Gagal mengambil data section",
      );
    }
  };

export const getCSMasterBySectionCd = async (
  sectionCd: string,
): Promise<CSMasterSectionResponse> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/customer-service/cs-master/section/${sectionCd}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        cache: "no-store",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error fetching CS Master Section by code:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal mengambil data section",
    );
  }
};

export const createCSMasterSection = async (
  sectionData: CSMasterSectionCreateRequest,
): Promise<CSMasterSectionSingleResponse> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/customer-service/cs-master/section`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify({
          section_cd: sectionData.section_cd,
          descs: sectionData.descs,
          audit_user: sectionData.audit_user,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error creating CS Master Section:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal membuat section baru",
    );
  }
};

export const updateCSMasterSection = async (
  id: number,
  sectionData: CSMasterSectionUpdateRequest,
): Promise<CSMasterSectionSingleResponse> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/customer-service/cs-master/section/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify({
          section_cd: sectionData.section_cd,
          descs: sectionData.descs,
          audit_user: sectionData.audit_user,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error updating CS Master Section:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal mengupdate section",
    );
  }
};

export const deleteCSMasterSection = async (
  id: number,
): Promise<CSMasterSectionSingleResponse> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/customer-service/cs-master/section/${id}`,
      {
        method: "DELETE",
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
    console.error("Error deleting CS Master Section:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal menghapus section",
    );
  }
};

export const validateSectionData = (
  data: CSMasterSectionCreateRequest | CSMasterSectionUpdateRequest,
): string[] => {
  const errors: string[] = [];

  if (!data.section_cd || data.section_cd.trim() === "") {
    errors.push("Section code harus diisi");
  }

  if (data.section_cd && data.section_cd.length > 10) {
    errors.push("Section code maksimal 10 karakter");
  }

  if (!data.descs || data.descs.trim() === "") {
    errors.push("Deskripsi harus diisi");
  }

  if (data.descs && data.descs.length > 100) {
    errors.push("Deskripsi maksimal 100 karakter");
  }

  if (!data.audit_user || data.audit_user.trim() === "") {
    errors.push("Audit user harus diisi");
  }

  return errors;
};

// ------------------------------------------------------------
// LABOUR MASTER
// ------------------------------------------------------------

export interface CSMasterLabourResponse {
  statusCode: number;
  message: string;
  data: CSMasterLabour[];
}

export interface CSMasterLabour {
  staff_id: string;
  name: string;
  category_cd: string;
  assigned_qty: number;
  late_qty: number;
  charges_amt: number;
  div_cd: string;
  dept_cd: string;
  audit_user: string;
  audit_date: string;
  rowID: number;
  report_seq_no: number;
  prefix: string;
  class_cd: string;
}

export interface CSMasterLabourSingleResponse {
  statusCode: number;
  message: string;
  data: CSMasterLabour;
}

export interface CSMasterLabourCreateRequest {
  staff_id: string;
  name: string;
  div_cd: string;
  dept_cd: string;
  prefix: string;
  audit_user: string;
}

export interface CSMasterLabourUpdateRequest {
  staff_id: string;
  name: string;
  div_cd: string;
  dept_cd: string;
  prefix: string;
  audit_user: string;
}

export const getCSMasterLabour = async (): Promise<CSMasterLabourResponse> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/customer-service/cs-master/labour`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        cache: "no-store",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error fetching CS Master Labour:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal mengambil data labour",
    );
  }
};

export const getCSMasterLabourById = async (
  rowID: number,
): Promise<CSMasterLabourResponse> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/customer-service/cs-master/labour/${rowID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        cache: "no-store",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error fetching CS Master Labour by ID:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal mengambil data labour",
    );
  }
};

export const createCSMasterLabour = async (
  labourData: CSMasterLabourCreateRequest,
): Promise<CSMasterLabourSingleResponse> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/customer-service/cs-master/labour`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify({
          staff_id: labourData.staff_id,
          name: labourData.name,
          div_cd: labourData.div_cd,
          dept_cd: labourData.dept_cd,
          prefix: labourData.prefix,
          audit_user: labourData.audit_user,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error creating CS Master Labour:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal membuat labour baru",
    );
  }
};

export const updateCSMasterLabour = async (
  rowID: number,
  labourData: CSMasterLabourUpdateRequest,
): Promise<CSMasterLabourSingleResponse> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/customer-service/cs-master/labour/${rowID}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify({
          staff_id: labourData.staff_id,
          name: labourData.name,
          div_cd: labourData.div_cd,
          dept_cd: labourData.dept_cd,
          prefix: labourData.prefix,
          audit_user: labourData.audit_user,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error updating CS Master Labour:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal mengupdate labour",
    );
  }
};

export const deleteCSMasterLabour = async (
  rowID: number,
): Promise<CSMasterLabourSingleResponse> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/customer-service/cs-master/labour/${rowID}`,
      {
        method: "DELETE",
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
    console.error("Error deleting CS Master Labour:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal menghapus labour",
    );
  }
};

export const validateLabourData = (
  data: CSMasterLabourCreateRequest | CSMasterLabourUpdateRequest,
): string[] => {
  const errors: string[] = [];

  if (!data.staff_id || data.staff_id.trim() === "") {
    errors.push("Staff ID harus diisi");
  }

  if (!data.name || data.name.trim() === "") {
    errors.push("Nama harus diisi");
  }

  if (data.name && data.name.length > 100) {
    errors.push("Nama maksimal 100 karakter");
  }

  if (!data.div_cd || data.div_cd.trim() === "") {
    errors.push("Division code harus diisi");
  }

  if (!data.dept_cd || data.dept_cd.trim() === "") {
    errors.push("Department code harus diisi");
  }

  if (!data.prefix || data.prefix.trim() === "") {
    errors.push("Prefix harus diisi");
  }

  if (!data.audit_user || data.audit_user.trim() === "") {
    errors.push("Audit user harus diisi");
  }

  return errors;
};

// ------------------------------------------------------------
// CATEGORY GROUP MASTER
// ------------------------------------------------------------

export interface CSMasterCategoryGroupResponse {
  statusCode: number;
  message: string;
  data: CSMasterCategoryGroup[];
}

export interface CSMasterCategoryGroup {
  category_group_cd: string;
  descs: string;
  audit_user: string;
  audit_date: string;
  rowID: string;
}

export interface CSMasterCategoryGroupSingleResponse {
  statusCode: number;
  message: string;
  data: CSMasterCategoryGroup;
}

export interface CSMasterCategoryGroupCreateRequest {
  category_group_cd: string;
  descs: string;
  audit_user: string;
}

export interface CSMasterCategoryGroupUpdateRequest {
  category_group_cd: string;
  descs: string;
  audit_user: string;
}

export const getCSMasterCategoryGroup =
  async (): Promise<CSMasterCategoryGroupResponse> => {
    try {
      const response = await fetch(
        `${process.env.CS_API_URL}/customer-service/cs-master/category-group`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`,
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching CS Master Category Group:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Gagal mengambil data category group",
      );
    }
  };

export const getCSMasterByCategoryGroupCd = async (
  categoryGroupCd: string,
): Promise<CSMasterCategoryGroupResponse> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/customer-service/cs-master/category-group/${categoryGroupCd}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        cache: "no-store",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error fetching CS Master Category Group by code:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Gagal mengambil data category group",
    );
  }
};

export const createCSMasterCategoryGroup = async (
  categoryGroupData: CSMasterCategoryGroupCreateRequest,
): Promise<CSMasterCategoryGroupSingleResponse> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/customer-service/cs-master/category-group`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify({
          category_group_cd: categoryGroupData.category_group_cd,
          descs: categoryGroupData.descs,
          audit_user: categoryGroupData.audit_user,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error creating CS Master Category Group:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Gagal membuat category group baru",
    );
  }
};

export const updateCSMasterCategoryGroup = async (
  id: number,
  categoryGroupData: CSMasterCategoryGroupUpdateRequest,
): Promise<CSMasterCategoryGroupSingleResponse> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/customer-service/cs-master/category-group/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify({
          category_group_cd: categoryGroupData.category_group_cd,
          descs: categoryGroupData.descs,
          audit_user: categoryGroupData.audit_user,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error updating CS Master Section:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal mengupdate section",
    );
  }
};

export const deleteCSMasterCategoryGroup = async (
  id: number,
): Promise<CSMasterCategoryGroupSingleResponse> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/customer-service/cs-master/category-group/${id}`,
      {
        method: "DELETE",
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
    console.error("Error deleting CS Master Category Group:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal menghapus category group",
    );
  }
};

export const validateCategoryGroupData = (
  data: CSMasterCategoryGroupCreateRequest | CSMasterCategoryGroupUpdateRequest,
): string[] => {
  const errors: string[] = [];

  if (!data.category_group_cd || data.category_group_cd.trim() === "") {
    errors.push("Category group code is required");
  } else {
    if (data.category_group_cd.length > 10) {
      errors.push("Category group code must be at most 10 characters");
    }
    if (!/^[A-Z0-9_-]+$/.test(data.category_group_cd)) {
      errors.push(
        "Category group code can only contain uppercase letters, numbers, dash (-), and underscore (_)",
      );
    }
  }

  if (!data.descs || data.descs.trim() === "") {
    errors.push("Description is required");
  } else if (data.descs.length > 255) {
    errors.push("Description must be at most 255 characters");
  }

  if (!data.audit_user || data.audit_user.trim() === "") {
    errors.push("Audit user is required");
  }

  return errors;
};

// ------------------------------------------------------------
// CATEGORY MASTER
// ------------------------------------------------------------

export interface CSMasterCategoryResponse {
  statusCode: number;
  message: string;
  data: CSMasterCategory[];
}

export interface CSMasterCategory {
  category_cd: string;
  descs: string;
  audit_user: string;
  audit_date: string;
  rowID: string;
  complain_type: string;
  category_priority: string;
  category_group_cd: string;
}

export interface CSMasterCategorySingleResponse {
  statusCode: number;
  message: string;
  data: CSMasterCategory;
}

export interface CSMasterCategoryCreateRequest {
  category_cd: string;
  descs: string;
  audit_user: string;
  complain_type: string;
  category_group_cd: string;
}

export interface CSMasterCategoryUpdateRequest {
  category_cd: string;
  descs: string;
  audit_user: string;
  complain_type: string;
  category_group_cd: string;
}

export const getCSMasterCategory =
  async (): Promise<CSMasterCategoryResponse> => {
    try {
      const response = await fetch(
        `${process.env.CS_API_URL}/customer-service/cs-master/category`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`,
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching CS Master Category:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Gagal mengambil data category",
      );
    }
  };

export const getCSMasterCategoryById = async (
  rowID: number,
): Promise<CSMasterCategoryResponse> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/customer-service/cs-master/category/${rowID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        cache: "no-store",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error fetching CS Master Category by ID:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal mengambil data category",
    );
  }
};

export const createCSMasterCategory = async (
  categoryData: CSMasterCategoryCreateRequest,
): Promise<CSMasterCategorySingleResponse> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/customer-service/cs-master/category`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify({
          category_cd: categoryData.category_cd,
          descs: categoryData.descs,
          audit_user: categoryData.audit_user,
          complain_type: categoryData.complain_type,
          category_group_cd: categoryData.category_group_cd,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error creating CS Master Category:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal membuat category baru",
    );
  }
};

export const updateCSMasterCategory = async (
  rowID: number,
  categoryData: CSMasterCategoryUpdateRequest,
): Promise<CSMasterCategorySingleResponse> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/customer-service/cs-master/category/${rowID}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify({
          category_cd: categoryData.category_cd,
          descs: categoryData.descs,
          audit_user: categoryData.audit_user,
          complain_type: categoryData.complain_type,
          category_group_cd: categoryData.category_group_cd,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error updating CS Master Category:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal mengupdate category",
    );
  }
};

export const deleteCSMasterCategory = async (
  rowID: number,
): Promise<CSMasterCategorySingleResponse> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/customer-service/cs-master/category/${rowID}`,
      {
        method: "DELETE",
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
    console.error("Error deleting CS Master Category:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal menghapus category",
    );
  }
};

export const validateCategoryData = (
  data: CSMasterCategoryCreateRequest | CSMasterCategoryUpdateRequest,
): string[] => {
  const errors: string[] = [];

  if (!data.category_cd || data.category_cd.trim() === "") {
    errors.push("Category code harus diisi");
  } else if (data.category_cd.length > 10) {
    errors.push("Category code maksimal 10 karakter");
  }

  if (!data.descs || data.descs.trim() === "") {
    errors.push("Deskripsi harus diisi");
  } else if (data.descs.length > 255) {
    errors.push("Deskripsi maksimal 255 karakter");
  }

  if (!data.complain_type || data.complain_type.trim() === "") {
    errors.push("Complain type harus diisi");
  }

  if (!data.category_group_cd || data.category_group_cd.trim() === "") {
    errors.push("Category priority harus diisi");
  }

  if (!data.audit_user || data.audit_user.trim() === "") {
    errors.push("Audit user harus diisi");
  }

  return errors;
};

// ------------------------------------------------------------
// CS SETUP
// ------------------------------------------------------------

export interface CSMasterSetupResponse {
  statusCode: number;
  message: string;
  data: CSMasterSetup[];
}

export interface CSMasterSetup {
  section_cd: string;
  category_cd: string;
  service_cd: string;
  trx_type: string;
  descs: string;
  service_day: number;
  audit_user: string;
  audit_date: string;
  labour_rate: number;
  currency_cd: string;
  tax_cd: string;
  rowID: string;
  staff_id: string;
}

export interface CSMasterSetupSingleResponse {
  statusCode: number;
  message: string;
  data: CSMasterSetup;
}

export interface CSMasterSetupCreateRequest {
  service_cd: string;
  section_cd: string;
  category_cd: string;
  trx_type: string;
  descs: string;
  service_day: number;
  tax_cd: string;
  currency_cd: string;
  labour_rate: number;
  audit_user: string;
}

export interface CSMasterSetupUpdateRequest {
  service_cd: string;
  section_cd: string;
  category_cd: string;
  trx_type: string;
  descs: string;
  service_day: number;
  tax_cd: string;
  currency_cd: string;
  labour_rate: number;
  audit_user: string;
}

export const getCSMasterSetup = async (): Promise<CSMasterSetupResponse> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/customer-service/cs-master/service`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        cache: "no-store",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error fetching CS Master Setup:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal mengambil data setup",
    );
  }
};

export const getCSMasterSetupById = async (
  rowID: string,
): Promise<CSMasterSetupResponse> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/customer-service/cs-master/service/${rowID}`,
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
    console.error("Error fetching CS Master Setup by ID:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal mengambil data setup",
    );
  }
};

export const createCSMasterSetup = async (
  setupData: CSMasterSetupCreateRequest,
): Promise<CSMasterSetupSingleResponse> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/customer-service/cs-master/service`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify({
          service_cd: setupData.service_cd,
          section_cd: setupData.section_cd,
          category_cd: setupData.category_cd,
          trx_type: setupData.trx_type,
          descs: setupData.descs,
          service_day: setupData.service_day,
          tax_cd: setupData.tax_cd,
          currency_cd: setupData.currency_cd,
          labour_rate: setupData.labour_rate,
          audit_user: setupData.audit_user,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error creating CS Master Setup:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal membuat data setup",
    );
  }
};

export const updateCSMasterSetup = async (
  rowID: string,
  setupData: CSMasterSetupUpdateRequest,
): Promise<CSMasterSetupSingleResponse> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/customer-service/cs-master/service/${rowID}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify({
          service_cd: setupData.service_cd,
          section_cd: setupData.section_cd,
          category_cd: setupData.category_cd,
          trx_type: setupData.trx_type,
          descs: setupData.descs,
          service_day: setupData.service_day,
          tax_cd: setupData.tax_cd,
          currency_cd: setupData.currency_cd,
          labour_rate: setupData.labour_rate,
          audit_user: setupData.audit_user,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error updating CS Master Setup:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal mengupdate setup",
    );
  }
};

export const deleteCSMasterSetup = async (
  rowID: number,
): Promise<CSMasterSetupSingleResponse> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/customer-service/cs-master/service/${rowID}`,
      {
        method: "DELETE",
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
    console.error("Error deleting CS Master Setup:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal menghapus setup",
    );
  }
};

export const validateSetupData = (
  data: CSMasterSetupCreateRequest | CSMasterSetupUpdateRequest,
): string[] => {
  const errors: string[] = [];

  if (!data.service_cd || data.service_cd.trim() === "") {
    errors.push("Service code harus diisi");
  } else if (data.service_cd.length > 10) {
    errors.push("Service code maksimal 10 karakter");
  }

  if (!data.section_cd || data.section_cd.trim() === "") {
    errors.push("Section code harus diisi");
  }

  if (!data.category_cd || data.category_cd.trim() === "") {
    errors.push("Category code harus diisi");
  }

  if (!data.trx_type || data.trx_type.trim() === "") {
    errors.push("Transaction type harus diisi");
  }

  if (!data.descs || data.descs.trim() === "") {
    errors.push("Deskripsi harus diisi");
  } else if (data.descs.length > 255) {
    errors.push("Deskripsi maksimal 255 karakter");
  }

  if (!data.service_day || data.service_day <= 0) {
    errors.push("Service day harus lebih dari 0");
  }

  if (!data.labour_rate || data.labour_rate < 0) {
    errors.push("Labour rate tidak boleh negatif");
  }

  if (!data.currency_cd || data.currency_cd.trim() === "") {
    errors.push("Currency code harus diisi");
  }

  if (!data.tax_cd || data.tax_cd.trim() === "") {
    errors.push("Tax code harus diisi");
  }

  if (!data.audit_user || data.audit_user.trim() === "") {
    errors.push("Audit user harus diisi");
  }

  return errors;
};

// ------------------------------------------------------------
// COMLAIN SOURCE
// ------------------------------------------------------------

export interface CSMasterComplainSourceResponse {
  statusCode: number;
  message: string;
  data: CSMasterComplainSource[];
}

export interface CSMasterComplainSource {
  complain_source: string;
  descs: string;
  audit_user: string;
  audit_date: string;
  rowID: string;
}

export interface CSMasterComplainSourceSingleResponse {
  statusCode: number;
  message: string;
  data: CSMasterComplainSource;
}

export interface CSMasterComplainSourceCreateRequest {
  complain_source: string;
  descs: string;
  audit_user: string;
}

export interface CSMasterComplainSourceUpdateRequest {
  complain_source: string;
  descs: string;
  audit_user: string;
}

export const getCSMasterComplainSource =
  async (): Promise<CSMasterComplainSourceResponse> => {
    try {
      const response = await fetch(
        `${process.env.CS_API_URL}/customer-service/cs-master/complain-source`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`,
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching CS Master Complain Source:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Gagal mengambil data complain source",
      );
    }
  };

export const getCSMasterByComplainSource = async (
  complainSource: string,
): Promise<CSMasterComplainSourceResponse> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/customer-service/cs-master/complain-source/${complainSource}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        cache: "no-store",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error fetching CS Master Complain Source by code:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Gagal mengambil data complain source",
    );
  }
};

export const createCSMasterComplainSource = async (
  complainSourceData: CSMasterComplainSourceCreateRequest,
): Promise<CSMasterComplainSourceSingleResponse> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/customer-service/cs-master/complain-source`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify({
          complain_source: complainSourceData.complain_source,
          descs: complainSourceData.descs,
          audit_user: complainSourceData.audit_user,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error creating CS Master Complain Source:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Gagal membuat complain source baru",
    );
  }
};

export const updateCSMasterComplainSource = async (
  id: number,
  complainSourceData: CSMasterComplainSourceUpdateRequest,
): Promise<CSMasterComplainSourceSingleResponse> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/customer-service/cs-master/complain-source/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify({
          complain_source: complainSourceData.complain_source,
          descs: complainSourceData.descs,
          audit_user: complainSourceData.audit_user,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error updating CS Master Complain Source:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Gagal mengupdate complain source",
    );
  }
};

export const deleteCSMasterComplainSource = async (
  id: number,
): Promise<CSMasterComplainSourceSingleResponse> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/customer-service/cs-master/complain-source/${id}`,
      {
        method: "DELETE",
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
    console.error("Error deleting CS Master Complain Source:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Gagal menghapus complain source",
    );
  }
};

export const validateComplainSourceData = (
  data:
    | CSMasterComplainSourceCreateRequest
    | CSMasterComplainSourceUpdateRequest,
): string[] => {
  const errors: string[] = [];

  if (!data.complain_source || data.complain_source.trim() === "") {
    errors.push("Complain source harus diisi");
  } else if (data.complain_source.length > 10) {
    errors.push("Complain source maksimal 10 karakter");
  }

  if (!data.descs || data.descs.trim() === "") {
    errors.push("Deskripsi harus diisi");
  } else if (data.descs.length > 255) {
    errors.push("Deskripsi maksimal 255 karakter");
  }

  if (!data.audit_user || data.audit_user.trim() === "") {
    errors.push("Audit user harus diisi");
  }

  return errors;
};

// ------------------------------------------------------------
// ITEM SETUP
// ------------------------------------------------------------

export interface CSMasterItemSetupResponse {
  statusCode: number;
  message: string;
  data: CSMasterItemSetup[];
}

export interface CSMasterItemSetup {
  item_cd: string;
  descs: string;
  trx_type: string;
  currency_cd: string;
  charge_amt: string;
  stock_cd: string;
  audit_user: string;
  audit_date: string;
  ic_flag: string;
  tax_cd: string;
  rowID: string;
  entity_cd: string;
  div_cd: string;
  dept_cd: string;
}

export interface CSMasterItemSetupSingleResponse {
  statusCode: number;
  message: string;
  data: CSMasterItemSetup;
}

export interface CSMasterItemSetupCreateRequest {
  ic_flag: string;
  item_cd: string;
  descs: string;
  trx_type: string;
  tax_cd: string;
  currency_cd: string;
  charge_amt: number;
  audit_user: string;
}

export interface CSMasterItemSetupUpdateRequest {
  ic_flag: string;
  item_cd: string;
  descs: string;
  trx_type: string;
  tax_cd: string;
  currency_cd: string;
  charge_amt: number;
  audit_user: string;
}

export const getCSMasterItemSetup =
  async (): Promise<CSMasterItemSetupResponse> => {
    try {
      const response = await fetch(
        `${process.env.CS_API_URL}/customer-service/cs-master/item-setup`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`,
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching CS Master Item Setup:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Gagal mengambil data item setup",
      );
    }
  };

export const getCSMasterByItemCd = async (
  itemCd: string,
): Promise<CSMasterItemSetupResponse> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/customer-service/cs-master/item-setup/${itemCd}`,
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
    console.error("Error fetching CS Master Item Setup by ID:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Gagal mengambil data item setup",
    );
  }
};

export const createCSMasterItemSetup = async (
  itemSetupData: CSMasterItemSetupCreateRequest,
): Promise<CSMasterItemSetupSingleResponse> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/customer-service/cs-master/item-setup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify({
          ic_flag: itemSetupData.ic_flag,
          item_cd: itemSetupData.item_cd,
          descs: itemSetupData.descs,
          trx_type: itemSetupData.trx_type,
          tax_cd: itemSetupData.tax_cd,
          currency_cd: itemSetupData.currency_cd,
          charge_amt: itemSetupData.charge_amt,
          audit_user: itemSetupData.audit_user,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error creating CS Master Setup:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal membuat data setup",
    );
  }
};

export const updateCSMasterItemSetup = async (
  rowID: string,
  itemSetupData: CSMasterItemSetupUpdateRequest,
): Promise<CSMasterItemSetupSingleResponse> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/customer-service/cs-master/item-setup/${rowID}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify({
          ic_flag: itemSetupData.ic_flag,
          item_cd: itemSetupData.item_cd,
          descs: itemSetupData.descs,
          trx_type: itemSetupData.trx_type,
          tax_cd: itemSetupData.tax_cd,
          currency_cd: itemSetupData.currency_cd,
          charge_amt: itemSetupData.charge_amt,
          audit_user: itemSetupData.audit_user,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error updating CS Master Setup:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal mengupdate setup",
    );
  }
};

export const deleteCSMasterItemSetup = async (
  rowID: number,
): Promise<CSMasterItemSetupSingleResponse> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/customer-service/cs-master/item-setup/${rowID}`,
      {
        method: "DELETE",
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
    console.error("Error deleting CS Master Item Setup:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal menghapus item setup",
    );
  }
};

// ------------------------------------------------------------
// FEEDBACK SETUP
// ------------------------------------------------------------

export interface CSMasterFeedbackSetupResponse {
  statusCode: number;
  message: string;
  data: CSMasterFeedbackSetup[];
}

export interface CSMasterFeedbackSetup {
  code: string;
  descs: string;
  rowID: string;
}

export interface CSMasterFeedbackSetupSingleResponse {
  statusCode: number;
  message: string;
  data: CSMasterFeedbackSetup;
}

export interface CSMasterFeedbackSetupCreateRequest {
  code: string;
  descs: string;
}

export interface CSMasterFeedbackSetupUpdateRequest {
  code: string;
  descs: string;
}

export const getCSMasterFeedbackSetup =
  async (): Promise<CSMasterFeedbackSetupResponse> => {
    try {
      const response = await fetch(
        `${process.env.CS_API_URL}/customer-service/cs-master/feedback-setup`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`,
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching CS Master Feedback Setup:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Gagal mengambil data feedback setup",
      );
    }
  };

export const getCSMasterByFeedbackCode = async (
  feedbackCode: string,
): Promise<CSMasterFeedbackSetupResponse> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/customer-service/cs-master/feedback-setup/${feedbackCode}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        cache: "no-store",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error fetching CS Master Feedback Setup by code:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Gagal mengambil data feedback setup",
    );
  }
};

export const createCSMasterFeedbackSetup = async (
  feedbackSetupData: CSMasterFeedbackSetupCreateRequest,
): Promise<CSMasterFeedbackSetupSingleResponse> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/customer-service/cs-master/feedback-setup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify({
          code: feedbackSetupData.code,
          descs: feedbackSetupData.descs,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error creating CS Master Feedback Setup:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Gagal membuat feedback setup baru",
    );
  }
};

export const updateCSMasterFeedbackSetup = async (
  id: number,
  feedbackSetupData: CSMasterFeedbackSetupUpdateRequest,
): Promise<CSMasterFeedbackSetupSingleResponse> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/customer-service/cs-master/feedback-setup/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify({
          code: feedbackSetupData.code,
          descs: feedbackSetupData.descs,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error updating CS Master Feedback Setup:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Gagal mengupdate feedback setup",
    );
  }
};

export const deleteCSMasterFeedbackSetup = async (
  id: number,
): Promise<CSMasterFeedbackSetupSingleResponse> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/customer-service/cs-master/feedback-setup/${id}`,
      {
        method: "DELETE",
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
    console.error("Error deleting CS Master Feedback Setup:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal menghapus feedback setup",
    );
  }
};

// ------------------------------------------------------------
// LOCATION
// ------------------------------------------------------------

export interface CSMasterLocationResponse {
  statusCode: number;
  message: string;
  data: CSMasterLocation[];
}

export interface CSMasterLocation {
  location_cd: string;
  descs: string;
  audit_user: string;
  audit_date: string;
  rowID: string;
}

export interface CSMasterLocationSingleResponse {
  statusCode: number;
  message: string;
  data: CSMasterLocation;
}

export interface CSMasterLocationCreateRequest {
  location_cd: string;
  descs: string;
  audit_user: string;
}

export interface CSMasterLocationUpdateRequest {
  location_cd: string;
  descs: string;
  audit_user: string;
}

/**
 * Validasi data location sebelum dikirim ke API
 * @param data - Data location yang akan divalidasi
 * @returns Array of error messages, empty if valid
 */
export const validateLocationData = (
  data: CSMasterLocationCreateRequest | CSMasterLocationUpdateRequest,
): string[] => {
  const errors: string[] = [];

  if (!data.location_cd || data.location_cd.trim() === "") {
    errors.push("Location code harus diisi");
  } else if (data.location_cd.length > 10) {
    errors.push("Location code maksimal 10 karakter");
  }

  if (!data.descs || data.descs.trim() === "") {
    errors.push("Deskripsi harus diisi");
  } else if (data.descs.length > 255) {
    errors.push("Deskripsi maksimal 255 karakter");
  }

  if (!data.audit_user || data.audit_user.trim() === "") {
    errors.push("Audit user harus diisi");
  }

  return errors;
};

/**
 * Mengambil semua data location
 * @returns Promise dengan data location
 * @throws Error jika gagal mengambil data
 */
export const getCSMasterLocation = async (): Promise<CSMasterLocationResponse> => {
  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/customer-service/cs-master/location-setup`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        cache: "no-store",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error fetching CS Master Location:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal mengambil data location",
    );
  }
};

/**
 * Mengambil data location berdasarkan kode
 * @param locationCd - Kode location yang dicari
 * @returns Promise dengan data location
 * @throws Error jika gagal mengambil data
 */
export const getCSMasterByLocationCd = async (
  locationCd: string,
): Promise<CSMasterLocationResponse> => {
  if (!locationCd || locationCd.trim() === "") {
    throw new Error("Location code harus diisi");
  }

  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/customer-service/cs-master/location-setup/${locationCd}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        cache: "no-store",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error fetching CS Master Location by code:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal mengambil data location",
    );
  }
};

/**
 * Membuat data location baru
 * @param locationData - Data location yang akan dibuat
 * @returns Promise dengan data location yang baru dibuat
 * @throws Error jika gagal membuat data
 */
export const createCSMasterLocation = async (
  locationData: CSMasterLocationCreateRequest,
): Promise<CSMasterLocationSingleResponse> => {
  // Validasi data sebelum dikirim
  const validationErrors = validateLocationData(locationData);
  if (validationErrors.length > 0) {
    throw new Error(validationErrors.join(", "));
  }

  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/customer-service/cs-master/location-setup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify({
          location_cd: locationData.location_cd.toUpperCase().trim(),
          descs: locationData.descs.trim(),
          audit_user: locationData.audit_user.trim(),
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error creating CS Master Location:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal membuat location baru",
    );
  }
};

/**
 * Mengupdate data location
 * @param id - ID location yang akan diupdate
 * @param locationData - Data location yang akan diupdate
 * @returns Promise dengan data location yang diupdate
 * @throws Error jika gagal mengupdate data
 */
export const updateCSMasterLocation = async (
  id: number,
  locationData: CSMasterLocationUpdateRequest,
): Promise<CSMasterLocationSingleResponse> => {
  if (!id || id <= 0) {
    throw new Error("ID location tidak valid");
  }

  // Validasi data sebelum dikirim
  const validationErrors = validateLocationData(locationData);
  if (validationErrors.length > 0) {
    throw new Error(validationErrors.join(", "));
  }

  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/customer-service/cs-master/location-setup/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify({
          location_cd: locationData.location_cd.toUpperCase().trim(),
          descs: locationData.descs.trim(),
          audit_user: locationData.audit_user.trim(),
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error updating CS Master Location:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal mengupdate location",
    );
  }
};

/**
 * Menghapus data location
 * @param id - ID location yang akan dihapus
 * @returns Promise dengan data location yang dihapus
 * @throws Error jika gagal menghapus data
 */
export const deleteCSMasterLocation = async (
  id: number,
): Promise<CSMasterLocationSingleResponse> => {
  if (!id || id <= 0) {
    throw new Error("ID location tidak valid");
  }

  try {
    const response = await fetch(
      `${process.env.CS_API_URL}/customer-service/cs-master/location-setup/${id}`,
      {
        method: "DELETE",
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
    console.error("Error deleting CS Master Location:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal menghapus location",
    );
  }
};

