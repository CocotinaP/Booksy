import { useState } from "react";
import { useNotifications } from "../features/notifications/useNotifications";

export default function NotificationBell() {
  const { unread, notifications, markRead, remove } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      {/* Bell Icon */}
      <div
        onClick={() => setOpen(!open)}
        style={{ cursor: "pointer", fontSize: "24px", position: "relative" }}
      >
        🔔
        {unread.length > 0 && (
          <span
            style={{
              position: "absolute",
              top: -5,
              right: -8,
              background: "red",
              color: "white",
              fontSize: "11px",
              padding: "2px 6px",
              borderRadius: "50%",
            }}
          >
            {unread.length}
          </span>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 30,
            width: "300px",
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "6px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            maxHeight: "400px",
            overflowY: "auto",
            zIndex: 100,
          }}
        >
          {notifications.length === 0 && (
            <div style={{ padding: 15, textAlign: "center" }}>
              Nu ai notificări.
            </div>
          )}

          {notifications.map((n) => (
            <div
              key={n.id}
              style={{
                padding: 12,
                background: n.is_read ? "#f5f5f5" : "#e3f2fd",
                borderBottom: "1px solid #eee",
                borderRadius: "4px",
              }}
            >
              {/* Titlu notificare */}
              <strong
                style={{
                  display: "block",
                  marginBottom: 5,
                  color: "#0d47a1",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                {n.type.replaceAll("_", " ")}
              </strong>

              {/* Mesaj */}
              <p
                style={{
                  margin: "5px 0",
                  color: "#222",
                  fontSize: "14px",
                  lineHeight: "1.3",
                }}
              >
                {n.message}
              </p>

              {/* Timp */}
              <small style={{ color: "#666", display: "block", marginBottom: 10 }}>
                {new Date(n.created_at).toLocaleString()}
              </small>

              {/* Butoane */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                {!n.is_read && (
                  <button
                    onClick={() => markRead(n.id)}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#1976d2",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      transition: "0.2s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#1565c0")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#1976d2")
                    }
                  >
                    ✔ Citește
                  </button>
                )}

                <button
                  onClick={() => remove(n.id)}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#d32f2f",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    transition: "0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#b71c1c")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#d32f2f")
                  }
                >
                  🗑 Șterge
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
