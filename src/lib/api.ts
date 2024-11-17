import axios from "axios";

interface ApiRequestPops {
  method: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  data?: unknown | FormData;
}

export async function apiRequest({
  method,
  url,
  headers,
  params,
  data,
}: ApiRequestPops) {
  try {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_APP_URL}${url}`,
      method,
      data,
      params,
      headers: {
        ...headers,
        ...(data instanceof FormData
          ? { "Content-Type": "multipart/form-data" }
          : {}),
      },
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
