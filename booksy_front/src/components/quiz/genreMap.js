export function normalizeGenreName(genre) {
  if (!genre) return genre;

  const g = genre.trim().toLowerCase();

  if (g === "sci-fi" || g === "sci fi" || g === "scifi") return "Science Fiction";
  return genre;
}
