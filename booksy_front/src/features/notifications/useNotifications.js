// src/features/notifications/useNotifications.js
import { useEffect, useState, useCallback } from "react";
import { notificationsApi } from "../../api/notificationsApi";

export function useNotifications(polling = 5000) {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState([]);

  const load = useCallback(async () => {
    try {
      const all = await notificationsApi.getAll();
      const unreadItems = await notificationsApi.getUnread();

      setNotifications(all);
      setUnread(unreadItems);
    } catch (e) {
      console.error("Failed to load notifications", e);
    }
  }, []);

  const markRead = async (id) => {
    await notificationsApi.markRead(id);
    await load();
  };

  const remove = async (id) => {
    await notificationsApi.delete(id);
    await load();
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, polling);
    return () => clearInterval(interval);
  }, [load, polling]);

  return { notifications, unread, markRead, remove };
}
