import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const fetchData = async (url, params) => {
  try {
    const response = await apiClient.get(url, { params });
    return response;
  } catch (error) {
    console.error(
      "Error in GET request:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

export const postData = async (url, data) => {
  try {
    const response = await apiClient.post(url, data);
    return response;
  } catch (error) {
    console.error(
      "Error in POST request:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};
