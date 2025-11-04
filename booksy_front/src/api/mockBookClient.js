// src/api/mockHttpClient.js
export function createMockHttpClient() {
  // pretend we have a small "database" in memory
  let books = [
    { id: 1, title: "Clean Code", author: "Robert C. Martin" },
    { id: 2, title: "The Pragmatic Programmer", author: "Andrew Hunt" },
    { id: 3, title: "Refactoring", author: "Martin Fowler" },
  ];

  // Simulate network delay
  const delay = (ms = 400) => new Promise(res => setTimeout(res, ms));

  async function request(method, path, { params, body } = {}) {
    await delay(); // simulate latency

    // basic routing simulation
    if (path === "/books" && method === "GET") {
      return [...books];
    }

    if (path.startsWith("/books/")) {
      const id = parseInt(path.split("/")[2], 10);
      const book = books.find(b => b.id === id);

      if (method === "GET") {
        if (!book) throw new Error(`Book ${id} not found`);
        return book;
      }

      if (method === "PUT") {
        if (!book) throw new Error(`Book ${id} not found`);
        Object.assign(book, body);
        return book;
      }

      if (method === "DELETE") {
        books = books.filter(b => b.id !== id);
        return { ok: true };
      }
    }

    if (path === "/books" && method === "POST") {
      const newBook = { id: Date.now(), ...body };
      books.push(newBook);
      return newBook;
    }

    throw new Error(`Mock endpoint not implemented: ${method} ${path}`);
  }

  return {
    get: (p, o) => request("GET", p, o),
    post: (p, o) => request("POST", p, o),
    put: (p, o) => request("PUT", p, o),
    del: (p, o) => request("DELETE", p, o),
  };
}
