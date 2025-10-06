import axios, { AxiosRequestConfig } from 'axios';

const API_URL = 'http://localhost:3000';
//  const API_URL = "https://coral-app-57xgb.ondigitalocean.app"

interface RequestOptions {
  isMultipart?: boolean; // if true, sends multipart/form-data
  headers?: Record<string, string>; // additional headers
}

// Function to get auth token from Redux store
const getAuthToken = () => {
  const persistedState = localStorage.getItem('persist:root');
  if (persistedState) {
    try {
      const parsed = JSON.parse(persistedState);
      const authState = JSON.parse(parsed.auth);
      return authState.token;
    } catch (error) {
      return null;
    }
  }
  return null;
};

// Function to get headers with auth token
const getHeaders = (options?: RequestOptions) => {
  const token = getAuthToken();
  const baseHeaders = options?.headers || {};
  
  if (token) {
    baseHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  if (!options?.isMultipart) {
    baseHeaders['Content-Type'] = 'application/json';
  }
  
  return baseHeaders;
};

// Basic GET request
export const getData = async (endpoint: string, options?: RequestOptions) => {
  const response = await axios.get(`${API_URL}${endpoint}`, {
    headers: getHeaders(options),
  });
  return response.data;
};

// Basic POST request
export const postData = async (endpoint: string, data: any, options?: RequestOptions) => {
  const config: AxiosRequestConfig = {
    headers: getHeaders(options),
  };

  const payload = options?.isMultipart ? data : JSON.stringify(data);
  console.log(endpoint , "endpoint");
  const response = await axios.post(`${API_URL}${endpoint}`, payload, config);
  return response.data;
};

// Basic PUT request
export const putData = async (endpoint: string, data: any, options?: RequestOptions) => {
  const config: AxiosRequestConfig = {
    headers: getHeaders(options),
  };

  const payload = options?.isMultipart ? data : JSON.stringify(data);

  const response = await axios.put(`${API_URL}${endpoint}`, payload, config);
  return response.data;
};

// Basic DELETE request
export const deleteData = async (endpoint: string, options?: RequestOptions) => {
  const response = await axios.delete(`${API_URL}${endpoint}`, {
    headers: getHeaders(options),
  });
  return response.data;
};
