import axios, { AxiosInstance } from "axios";

export const api: AxiosInstance = axios.create({
  baseURL: "https://api.exchangerate.host",
  headers: {
    Accept: "application/json",
  },
});
