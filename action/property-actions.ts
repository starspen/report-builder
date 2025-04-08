"use server";

const mode = `${process.env.NEXT_PUBLIC_ENV_MODE}`;

export const getDivisions = async () => {
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }
    const response = await fetch(`${url}/api/getDiv`, {
      method: "GET",
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message);
    }
    return result;
  } catch (error) {
    console.error("Error fetching divisions:", error);
    throw new Error("Failed to fetch divisions");
  }
};

export const getDepartments = async () => {
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }
    const response = await fetch(`${url}/api/getDept`, {
      method: "GET",
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message);
    }
    return result;
  } catch (error) {
    console.error("Error fetching departments:", error);
    throw new Error("Failed to fetch departments");
  }
};
