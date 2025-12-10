import { useNotifications } from "../features/notifications/useNotifications";

export default function NotificationsPage() {
  const { notifications, markRead, remove } = useNotifications();

  return (
    <div style={{ padding: 20 }}>
      <h2>Notificările tale</h2>

      {notifications.length === 0 && <p>Nu ai notificări.</p>}

      {notifications.map((n) => (
        <div
          key={n.id}
          style={{
            padding: 15,
            background: n.is_read ? "#f1f1f1" : "#d6ebff",
            border: "1px solid #ccc",
            borderRadius: 6,
            marginBottom: 10,
          }}
        >
          <h4>{n.type}</h4>
          <p>{n.message}</p>
          <small>{new Date(n.created_at).toLocaleString()}</small>

          <div style={{ marginTop: 10 }}>
            {!n.is_read && (
              <button onClick={() => markRead(n.id)} style={{ marginRight: 10 }}>
                ✔ Citește
              </button>
            )}
            <button onClick={() => remove(n.id)}>🗑 Șterge</button>
          </div>
        </div>
      ))}
    </div>
  );
}
