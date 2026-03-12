export type DataSource = "dummy" | "api";

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api/v1",
  dataSource: (import.meta.env.VITE_DATA_SOURCE ?? "dummy") as DataSource,
};

