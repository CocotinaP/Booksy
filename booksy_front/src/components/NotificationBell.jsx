import { useState, useRef } from "react"; // <-- 1. IMPORTĂM useRef
import { useNotifications } from "../features/notifications/useNotifications";

export default function NotificationBell() {
  const { unread, notifications, markRead, remove } = useNotifications();
  const [open, setOpen] = useState(false);
  
  // 2. Variabila care ține minte timer-ul
  const closeTimeoutRef = useRef(null);

  // Funcția când intrăm cu mouse-ul (Pe clopoțel SAU pe listă)
  const handleMouseEnter = () => {
    // Dacă exista o comandă de închidere în așteptare, o ANULĂM.
    // Asta înseamnă că utilizatorul s-a întors repede pe meniu.
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpen(true);
  };

  // Funcția când ieșim cu mouse-ul
  const handleMouseLeave = () => {
    // Nu închidem instant! Pornim un cronometru de 300ms (0.3 secunde)
    closeTimeoutRef.current = setTimeout(() => {
      setOpen(false);

      // Logica de marcare ca citit se execută abia când se închide efectiv
      if (unread.length > 0) {
        unread.forEach((n) => {
          markRead(n.id);
        });
      }
    }, 300); // <-- Aici poți mări timpul dacă vrei (ex: 500 pentru jumătate de secundă)
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        height: "100%",
        
        transform: "translateY(1px)", 
        
        cursor: "pointer",
        marginRight: "15px"
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* --- ICONIȚA CLOPOȚEL --- */}
      <div
        style={{ cursor: "pointer", fontSize: "24px", position: "relative" }}
      >
        🔔
        {unread.length > 0 && (
          <span
            style={{
              position: "absolute",
              top: -5,
              right: -5,
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

      {/* --- LISTA POPUP --- */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "100%",
            width: "300px",
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "6px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            maxHeight: "400px",
            overflowY: "auto",
            zIndex: 1000,
          }}
          // E important să avem și aici mouseEnter ca să țină meniul deschis
          onMouseEnter={handleMouseEnter} 
        >
          {notifications.length === 0 && (
            <div style={{ padding: 15, textAlign: "center", color: "#666" }}>
              Nu ai notificări noi.
            </div>
          )}

          {notifications.map((n) => (
            <div
              key={n.id}
              style={{
                padding: "12px",
                background: n.is_read ? "#fff" : "#c8e6c9", // Verdele ales de tine
                borderBottom: "1px solid #eee",
                transition: "background 0.3s",
              }}
            >
              <div style={{ marginBottom: "4px" }}>
                <strong style={{ color: "#333", textTransform: "capitalize" }}>
                  {n.type
                    ? n.type.replace(/_/g, " ").toLowerCase()
                    : "Notificare"}
                </strong>
              </div>

              <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#555" }}>
                {n.message}
              </p>

              <small
                style={{
                  color: "#666",
                  fontSize: "11px",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                {new Date(n.created_at).toLocaleString("ro-RO")}
              </small>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => remove(n.id)}
                  style={{
                    padding: "4px 8px",
                    fontSize: "12px",
                    background: "#ff5252",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  ✕ Șterge
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}