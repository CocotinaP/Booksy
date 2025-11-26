// src/api/httpClient.js
export function createHttpClient({ baseURL, getToken }) {
  const base = baseURL.replace(/\/+$/, "");

  const request = async (method, path, { params, body } = {}) => {
    const url = new URL(base + path);
    if (params) {
      Object.entries(params).forEach(([k, v]) => v != null && url.searchParams.append(k, v));
    }

    const headers = { Accept: "application/json" };
    const token = getToken?.() || localStorage.getItem("access");
    if (token) headers.Authorization = `Bearer ${token}`;
    if (body && !(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(url.toString(), {
      method,
      headers,
      body:
      body instanceof FormData
        ? body
        : body !== undefined
          ? JSON.stringify(body)
          : undefined,

      credentials: "omit", // drop if you don't use cookies
    });

    const ctype = res.headers.get("content-type") || "";
    const parse = ctype.includes("json") ? () => res.json() : () => res.text();
    const data = await parse();

    if (!res.ok) {
      const err = new Error((data && (data.message || data.error)) || `HTTP ${res.status}`);
      err.status = res.status; err.payload = data;
      console.error("PAYLOAD COMPLET:", data);
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
