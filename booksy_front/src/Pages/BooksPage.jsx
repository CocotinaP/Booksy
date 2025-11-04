import { Box, Typography, List, Divider, Stack, Pagination, TextField, IconButton, CircularProgress, Alert } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useState, useEffect, useMemo } from "react";

import { useBooks } from "../features/books/useBooks";
import { bookApi } from "../api/index";
import Book from "../features/books/Book"; // 👈 import component

export default function BooksPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => {
    const id = setTimeout(() => setQ(search.trim()), 300);
    return () => clearTimeout(id);
  }, [search]);

  const queryKeyOpts = useMemo(() => ({ page, pageSize, q }), [page, pageSize, q]);
  const { data, isLoading, isFetching, error, refetch } = useBooks(bookApi, queryKeyOpts);

  const items = data?.items ?? data ?? [];
  const total = data?.total ?? items.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  const handleEdit = (book) => {
    console.log("Edit:", book);
  };

  const handleDelete = (book) => {
    console.log("Delete:", book);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5">Books</Typography>
        <Stack direction="row" spacing={1} sx={{ width: 400, maxWidth: "100%" }}>
          <TextField
            size="small"
            fullWidth
            label="Search"
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
          />
          <IconButton onClick={() => refetch()} disabled={isFetching}>
            <RefreshIcon />
          </IconButton>
        </Stack>
      </Stack>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error.message || "Failed to load books"}</Alert>
      ) : (
        <>
          {items.length === 0 ? (
            <Typography>No books found.</Typography>
          ) : (
            <List>
              {items.map((book, index) => (
                <Box key={book.id ?? index}>
                  <Book book={book} onEdit={handleEdit} onDelete={handleDelete} />
                  {index < items.length - 1 && <Divider component="li" />}
                </Box>
              ))}
            </List>
          )}

          <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
            <Pagination count={pageCount} page={page} onChange={(_, v) => setPage(v)} />
          </Stack>
        </>
      )}
    </Box>
  );
}
