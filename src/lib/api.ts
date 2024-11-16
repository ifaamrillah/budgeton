import axios from "axios";

export async function apiRequest(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  data?: unknown | undefined
) {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_APP_URL}${url}`,
      method,
      data,
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
      };
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
}
