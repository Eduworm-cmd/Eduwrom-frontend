const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const apiRequest = async (url, {
  method = "GET",
  headers = {},
  body = null,
  credentials = "include",
  authorization = null
} = {}) => {
  try {
    if (authorization) {
      headers.authorization = `Bearer ${authorization}`;
    }

    const fullUrl = `${BASE_URL}${url}`;
    const response = await fetch(fullUrl, {
      method,
      credentials,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "API Error");
    }

    return await response.json();
  } catch (error) {
    console.error("API Request Error:", error.message);
    throw error;
  }
};

export { apiRequest };
