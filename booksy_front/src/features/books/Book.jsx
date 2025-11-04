import { Box, ListItem, ListItemText, IconButton, Stack, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

/**
 * Reusable Book component
 * @param {Object} props
 * @param {Object} props.book - The book data
 * @param {Function} [props.onEdit] - Called when edit button is clicked
 * @param {Function} [props.onDelete] - Called when delete button is clicked
 */
export default function Book({ book, onEdit, onDelete }) {
  return (
    <ListItem
      disableGutters
      secondaryAction={
        <Stack direction="row" spacing={1}>
          {onEdit && (
            <Tooltip title="Edit">
              <IconButton edge="end" onClick={() => onEdit(book)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title="Delete">
              <IconButton edge="end" color="error" onClick={() => onDelete(book)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      }
    >
      <Box sx={{ flexGrow: 1 }}>
        <ListItemText
          primary={book.title || "(Untitled Book)"}
          secondary={book.author ? `Author: ${book.author}` : undefined}
        />
      </Box>
    </ListItem>
  );
}
