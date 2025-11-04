// BookProvider.js
export default class BookProvider {
  constructor({ baseURL, getToken } = {}) {
    if (!baseURL) throw new Error("BookProvider requires baseURL");
    this.baseURL = baseURL.replace(/\/+$/, "");
    this.getToken = getToken; // optional: () => token or async () => token
  }

  // ---------- Public API ----------
  getBook(id) {
    return this._request("GET", `/books/${encodeURIComponent(id)}`);
  }

  listBooks({ page = 1, pageSize = 20, search } = {}) {
    const params = { page, pageSize, ...(search ? { q: search } : {}) };
    return this._request("GET", "/books", { params });
  }

  createBook(data) {
    return this._request("POST", "/books", { body: data });
  }

  updateBook(id, data) {
    return this._request("PUT", `/books/${encodeURIComponent(id)}`, { body: data });
  }

  deleteBook(id) {
    return this._request("DELETE", `/books/${encodeURIComponent(id)}`);
  }

  // ---------- Internals ----------
  _buildURL(path, params) {
    const url = new URL(this.baseURL + path, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) url.searchParams.append(k, String(v));
      });
    }
    return url.toString();
  }

  async _request(method, path, { params, body } = {}) {
    const headers = { Accept: "application/json" };
    if (body !== undefined) headers["Content-Type"] = "application/json";

    const token = this.getToken ? await this.getToken() : null;
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(this._buildURL(path, params), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      credentials: "include", // remove if you don't use cookies
    });

    const contentType = res.headers.get("content-type") || "";
    const parse = contentType.includes("json") ? () => res.json() : () => res.text();
    const data = await parse();

    if (!res.ok) {
      const message = (data && (data.message || data.error)) || `HTTP ${res.status}`;
      const err = new Error(message);
      err.status = res.status;
      err.payload = data;
      throw err;
    }
    return data;
  }
}
