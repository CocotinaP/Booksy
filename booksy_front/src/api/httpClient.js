// src/api/httpClient.js
export function createHttpClient({ baseURL, getToken }) {
  const base = baseURL.replace(/\/+$/, "");

  const request = async (method, path, { params, body } = {}) => {
    const url = new URL(base + path, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([k, v]) => v != null && url.searchParams.append(k, v));
    }

    const headers = { Accept: "application/json" };
    const token = getToken?.();
    if (token) headers.Authorization = `Bearer ${token}`;
    if (body !== undefined) headers["Content-Type"] = "application/json";

    const res = await fetch(url.toString(), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      credentials: "include", // drop if you don't use cookies
    });

    const ctype = res.headers.get("content-type") || "";
    const parse = ctype.includes("json") ? () => res.json() : () => res.text();
    const data = await parse();

    if (!res.ok) {
      const err = new Error((data && (data.message || data.error)) || `HTTP ${res.status}`);
      err.status = res.status; err.payload = data;
      throw err;
    }
    return data;
  };

  return {
    get: (p, o) => request("GET", p, o),
    post: (p, o) => request("POST", p, o),
    put: (p, o) => request("PUT", p, o),
    del: (p, o) => request("DELETE", p, o),
  };
}
