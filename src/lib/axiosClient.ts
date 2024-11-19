import axios, { AxiosError, AxiosResponse } from "axios";

const axiosClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_APP_URL}/api`,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 400) {
        // Handle bad request error
        console.error("Bad Request: ", error.response.data);
      } else if (status === 401) {
        // Handle unauthorized error
        window.location.href = "/sign-in";
      } else if (status === 403) {
        // Handle forbidden error (e.g., pro plan expired)
        console.error("Forbidden: ", error.response.data);
      } else if (status === 422) {
        // Handle unprocessable entity error (e.g., synchronization required)
        window.location.href = "/sync";
      } else {
        // Handle other errors
        console.error("Unexpected Error: ", error.response.data);
      }
    } else {
      // Handle cases where error.response is undefined
      console.error("Network or unexpected error: ", error.message);
    }

    return Promise.reject(error);
  }
);

function handleAxiosError(error: unknown) {
  if (axios.isAxiosError(error)) {
    throw error;
  }

  // Handle non-Axios errors
  return new Error("An unexpected error occurred.");
}

export async function apiGet({
  url,
  params,
}: {
  url: string;
  params?: Record<string, unknown>;
}) {
  try {
    const res = await axiosClient.get(url, { params });
    return res.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
}

export async function apiPost({
  url,
  data,
  params,
}: {
  url: string;
  data?: unknown;
  params?: Record<string, unknown>;
}) {
  try {
    const res = await axiosClient.post(url, data, { params });
    return res.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
}

export async function apiPostFormData({
  url,
  formData,
  params,
}: {
  url: string;
  formData?: FormData;
  params?: Record<string, unknown>;
}) {
  try {
    const res = await axios.post(url, formData, {
      params,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
}

export async function apiPatch({
  url,
  data,
  params,
}: {
  url: string;
  data?: unknown;
  params?: Record<string, unknown>;
}) {
  try {
    const res = await axiosClient.patch(url, data, { params });
    return res.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
}

export async function apiPatchFormData({
  url,
  formData,
  params,
}: {
  url: string;
  formData?: FormData;
  params?: Record<string, unknown>;
}) {
  try {
    const res = await axios.patch(url, formData, {
      params,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
}

export async function apiDelete({
  url,
  params,
}: {
  url: string;
  params?: Record<string, unknown>;
}) {
  try {
    const res = await axiosClient.delete(url, { params });
    return res.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
}
