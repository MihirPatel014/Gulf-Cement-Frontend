import { env } from "../config/env";

// function getAuthHeaders() {
//   const token = localStorage.getItem("auth_access_token");

//   return {
//     "Content-Type": "application/json",
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//   };
// }

export async function httpGet<T>(path: string): Promise<T> {

  const token = localStorage.getItem("auth_access_token");

  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GET ${path} failed: ${response.status} ${body}`);
  }

  return (await response.json()) as T;
}


export async function httpPost<T>(path: string, body: unknown): Promise<T> {

  const token = localStorage.getItem("auth_access_token");

  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body),
  });

  // Try to parse JSON response body
  let resBody: string;
  try {
    resBody = await response.text();
  } catch {
    resBody = '';
  }

  // For 4xx errors, try to parse as JSON and return it instead of throwing
  if (!response.ok && response.status >= 400 && response.status < 500) {
    try {
      const parsed = JSON.parse(resBody);
      return parsed as T;
    } catch {
      throw new Error(`POST ${path} failed: ${response.status} ${resBody}`);
    }
  }

  if (!response.ok) {
    throw new Error(`POST ${path} failed: ${response.status} ${resBody}`);
  }

  return JSON.parse(resBody) as T;
}

export async function httpPut<T>(path: string, body: unknown): Promise<T> {

  const token = localStorage.getItem("auth_access_token");

  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const resBody = await response.text();
    throw new Error(`PUT ${path} failed: ${response.status} ${resBody}`);
  }

  return (await response.json()) as T;
}

export async function httpDelete(path: string): Promise<void> {
  const token = localStorage.getItem("auth_access_token");
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
  });

  if (!response.ok) {
    const resBody = await response.text();
    throw new Error(`DELETE ${path} failed: ${response.status} ${resBody}`);
  }
}
