// src/features/books/__mocks__/bookApi.js
export function createBookApi() {
  // Mock DB
  let books = [
    { id: 1, title: "Clean Code", author: "Robert C. Martin" },
    { id: 2, title: "The Pragmatic Programmer", author: "Andrew Hunt" },
    { id: 3, title: "Refactoring", author: "Martin Fowler" },
  ];

  return {
    list({ page = 1, pageSize = 20, q } = {}) {
      let filtered = books;
      if (q) {
        filtered = books.filter(
          (b) =>
            b.title.toLowerCase().includes(q.toLowerCase()) ||
            b.author.toLowerCase().includes(q.toLowerCase())
        );
      }
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      return Promise.resolve({
        data: filtered.slice(start, end),
        total: filtered.length,
        page,
        pageSize,
      });
    },

    get(id) {
      const book = books.find((b) => b.id === Number(id));
      return book
        ? Promise.resolve({ data: book })
        : Promise.reject(new Error("Book not found"));
    },

    create(payload) {
      const newBook = { id: Date.now(), ...payload };
      books.push(newBook);
      return Promise.resolve({ data: newBook });
    },

    update(id, payload) {
      const idx = books.findIndex((b) => b.id === Number(id));
      if (idx === -1) return Promise.reject(new Error("Book not found"));
      books[idx] = { ...books[idx], ...payload };
      return Promise.resolve({ data: books[idx] });
    },

    remove(id) {
      const idx = books.findIndex((b) => b.id === Number(id));
      if (idx === -1) return Promise.reject(new Error("Book not found"));
      const [deleted] = books.splice(idx, 1);
      return Promise.resolve({ data: deleted });
    },
  };
}
