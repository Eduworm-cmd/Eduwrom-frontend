// src/utils/apiRequest.js

import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const apiRequest = async (
  url,
  {
    method = "GET",
    headers = {},
    body = null,
    credentials = "include",
  } = {}
) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const fullUrl = `${BASE_URL}${url}`;

    const options = {
      method,
      credentials,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (body && method !== "GET" && method !== "HEAD") {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(fullUrl, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API Error");
    }

    return data;
  } catch (error) {
    console.error("API Request Error:", error.message);
    toast.error(error.message || "An error occurred while making the API request.");
    throw error;
  }
};

export { apiRequest };
