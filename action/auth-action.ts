"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { signIn } from "@/lib/auth";

const mode = `${process.env.NEXT_PUBLIC_ENV_MODE}`;

export const loginUser = async (data: any) => {
  try {
    const response = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    console.log("SignIn Response:", response);

    if (response?.error) {
      console.error("SignIn Error:", response.error);
      // new CredentialsSignin(message?, errorOptions?): CredentialsSignin
    } else {
      console.log("SignIn Success:", response);
    }

    return response;
  } catch (error) {
    console.error("Error during signIn:", error);

    throw new Error(error as string);
  }
};

// export const loginUser = async (data: any) => {
//   try {
//     let url = "";
//     if (mode === "sandbox") {
//       url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
//     } else {
//       url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
//     }

//     const response = await fetch(`${url}/auth/user/login`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });
//     const result = await response.json();
//     console.log(result);

//     if (result.statusCode === 200) {
//       await signIn("credentials", {
//         email: result.data.email,
//         password: result.data.password,
//         redirect: false,
//       });
//       return result;
//     } else {
//       return result;
//     }
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return error;
//   }
// };
