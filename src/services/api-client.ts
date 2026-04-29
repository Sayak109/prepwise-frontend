import axios from "axios";

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api", withCredentials: true });
let refreshing = false;
let queue: Array<() => void> = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error?.response?.status !== 401 || original?._retry) return Promise.reject(error);
    original._retry = true;
    if (refreshing) {
      await new Promise<void>((resolve) => queue.push(resolve));
      return api(original);
    }
    refreshing = true;
    try {
      await axios.post(`${api.defaults.baseURL}/auth/refresh`, {}, { withCredentials: true });
      queue.forEach((resolve) => resolve());
      queue = [];
      return api(original);
    } finally {
      refreshing = false;
    }
  }
);

export default api;
