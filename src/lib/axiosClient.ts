import axios from "axios";

const axiosClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_APP_URL}/api`,
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 400) {
      // handle errors bad request
    } else if (error.response.status === 401) {
      // handle errors for users who have not authorized
      window.location.href = "/sign-in";
    } else if (error.response.status === 403) {
      // handle errors for users who have pro plan expired
    } else if (error.response.status === 422) {
      // handle errors for users who have not synchronized
      window.location.href = "/sync";
    }
    return Promise.reject(error);
  }
);

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
    if (axios.isAxiosError(error)) {
      throw {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
      };
    }
    throw new Error("An unexpected error occurred.");
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
    if (axios.isAxiosError(error)) {
      throw {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
      };
    }
    throw new Error("An unexpected error occurred.");
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
    if (axios.isAxiosError(error)) {
      throw {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
      };
    }
    throw new Error("An unexpected error occurred.");
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
    if (axios.isAxiosError(error)) {
      throw {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
      };
    }
    throw new Error("An unexpected error occurred.");
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
    if (axios.isAxiosError(error)) {
      throw {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
      };
    }
    throw new Error("An unexpected error occurred.");
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
    if (axios.isAxiosError(error)) {
      throw {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
      };
    }
    throw new Error("An unexpected error occurred.");
  }
}
