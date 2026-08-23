// src/public_app/layout/navbar/components/Notification.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaBell, FaCheckCircle, FaTimes } from "react-icons/fa";
import { useTheme } from "../../../../theme";

const Notification = ({
  notifications = [],
  position = "right",
  maxHeight = "max-h-96",
  width = "w-80",
  showCount = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localNotifications, setLocalNotifications] = useState(notifications);
  const notificationRef = useRef(null);
  const { theme } = useTheme();

  const unreadCount = localNotifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const markAsRead = (id) => {
    setLocalNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
  };

  const markAllAsRead = () => {
    setLocalNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true })),
    );
  };

  const clearAll = () => {
    setLocalNotifications([]);
  };

  const positionClasses = {
    right: "right-0",
    left: "left-0",
    center: "left-1/2 transform -translate-x-1/2",
  };

  return (
    <div className="relative" ref={notificationRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 ${theme.text.accent} ${theme.background.cardHover} rounded-full transition-all relative group`}
        aria-label="Notifications"
      >
        <FaBell size={18} />
        {showCount && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className={`absolute ${positionClasses[position]} mt-2 ${width} ${theme.background.card} rounded-2xl shadow-xl border ${theme.border.accent} py-2 z-50`}
        >
          <div
            className={`px-4 py-2 text-sm font-semibold ${theme.text.accent} border-b ${theme.border.accent} flex justify-between items-center`}
          >
            <div className="flex items-center gap-2">
              <FaBell className={theme.icon.primary} />
              <span>Notifications</span>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-amber-600 hover:text-amber-700 hover:underline"
                >
                  Mark all read
                </button>
              )}
              {localNotifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs text-gray-400 hover:text-gray-600"
                  title="Clear all"
                >
                  <FaTimes size={12} />
                </button>
              )}
            </div>
          </div>

          {localNotifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <FaCheckCircle className="mx-auto text-3xl text-green-400 mb-2" />
              <p className="text-sm">All caught up!</p>
              <p className="text-xs mt-1">No new notifications</p>
            </div>
          ) : (
            <div className={`${maxHeight} overflow-y-auto`}>
              {localNotifications.map((notif) => {
                const Icon = notif.icon;
                return (
                  <Link
                    key={notif.id}
                    to={notif.link || "#"}
                    onClick={() => markAsRead(notif.id)}
                    className={`block px-4 py-3 hover:bg-amber-50 dark:hover:bg-amber-900/20 cursor-pointer transition ${
                      !notif.read ? "bg-amber-50/50 dark:bg-amber-900/10" : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      {Icon && (
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center ${notif.iconColor}`}
                        >
                          <Icon size={16} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium ${theme.text.primary}`}
                        >
                          {notif.message}
                        </p>
                        {notif.description && (
                          <p
                            className={`text-xs ${theme.text.tertiary} mt-0.5 line-clamp-1`}
                          >
                            {notif.description}
                          </p>
                        )}
                        <p className={`text-[10px] ${theme.text.light} mt-1`}>
                          {notif.time}
                        </p>
                      </div>
                      {!notif.read && (
                        <div
                          className={`w-2 h-2 ${theme.text.accent.replace("text", "bg")} rounded-full mt-1`}
                        ></div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {localNotifications.length > 0 && (
            <div
              className={`px-4 py-2 text-center border-t ${theme.border.accent}`}
            >
              <Link
                to="/notifications"
                className={`text-sm ${theme.text.accent} hover:underline`}
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;
