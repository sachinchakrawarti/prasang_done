// src/public_app/layout/navbar/components/Notification.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaBell,
  FaCheckCircle,
  FaInfoCircle,
  FaHeart,
  FaUserPlus,
  FaFeather,
  FaTimes,
} from "react-icons/fa";
import { useTheme } from "../../../../theme";

// Sample notification data - in real app, this would come from an API/context
const sampleNotifications = [
  {
    id: 1,
    type: "poem",
    message: "New poem from William Shakespeare",
    description: "Sonnet 154 has been added to the collection",
    time: "5 min ago",
    read: false,
    icon: FaFeather,
    iconColor: "text-amber-500",
    link: "/poem/154",
  },
  {
    id: 2,
    type: "like",
    message: "Your poem 'Sonnet 18' got 50 likes",
    description: "Congratulations! Your poem is trending",
    time: "1 hour ago",
    read: false,
    icon: FaHeart,
    iconColor: "text-rose-500",
    link: "/poem/18",
  },
  {
    id: 3,
    type: "poet",
    message: "Faiz Ahmed Faiz published new ghazal",
    description: "New ghazal added to his collection",
    time: "3 hours ago",
    read: true,
    icon: FaFeather,
    iconColor: "text-emerald-500",
    link: "/poems-types/gazal/faiz/urdu",
  },
  {
    id: 4,
    type: "event",
    message: "Weekly poetry contest starts tomorrow",
    description: "Theme: 'Nature's Beauty' - Submit your entries",
    time: "1 day ago",
    read: true,
    icon: FaInfoCircle,
    iconColor: "text-purple-500",
    link: "/contests",
  },
  {
    id: 5,
    type: "follow",
    message: "John Keats started following you",
    description: "You have a new follower",
    time: "2 days ago",
    read: true,
    icon: FaUserPlus,
    iconColor: "text-blue-500",
    link: "/poet/john-keats",
  },
];

const Notification = ({
  notifications = sampleNotifications,
  onNotificationClick,
  onMarkAllRead,
  position = "right",
  maxHeight = "max-h-96",
  width = "w-80",
  showCount = true,
  autoClose = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localNotifications, setLocalNotifications] = useState(notifications);
  const notificationRef = useRef(null);
  const { theme, themeName } = useTheme();

  const unreadCount = localNotifications.filter((n) => !n.read).length;

  // Theme-based styling helpers
  const getAccentColor = () => {
    switch (themeName) {
      case "forest":
        return "text-green-600 dark:text-green-400";
      case "lavender":
        return "text-purple-600 dark:text-purple-400";
      case "rose":
        return "text-rose-600 dark:text-rose-400";
      case "sepia":
        return "text-amber-700 dark:text-amber-400";
      default:
        return "text-amber-600 dark:text-amber-400";
    }
  };

  const getHoverBgColor = () => {
    switch (themeName) {
      case "forest":
        return "hover:bg-green-100 dark:hover:bg-green-900/30";
      case "lavender":
        return "hover:bg-purple-100 dark:hover:bg-purple-900/30";
      case "rose":
        return "hover:bg-rose-100 dark:hover:bg-rose-900/30";
      case "sepia":
        return "hover:bg-amber-200 dark:hover:bg-amber-900/30";
      default:
        return "hover:bg-amber-100 dark:hover:bg-amber-900/30";
    }
  };

  const getBorderColor = () => {
    switch (themeName) {
      case "forest":
        return "border-green-200 dark:border-green-800";
      case "lavender":
        return "border-purple-200 dark:border-purple-800";
      case "rose":
        return "border-rose-200 dark:border-rose-800";
      case "sepia":
        return "border-amber-300 dark:border-amber-700";
      default:
        return "border-amber-200 dark:border-amber-800";
    }
  };

  const getIconBgColor = () => {
    switch (themeName) {
      case "forest":
        return "bg-green-100 dark:bg-green-900/30";
      case "lavender":
        return "bg-purple-100 dark:bg-purple-900/30";
      case "rose":
        return "bg-rose-100 dark:bg-rose-900/30";
      case "sepia":
        return "bg-amber-200 dark:bg-amber-900/30";
      default:
        return "bg-amber-100 dark:bg-amber-900/30";
    }
  };

  const getUnreadBgColor = () => {
    switch (themeName) {
      case "forest":
        return "bg-green-50/50 dark:bg-green-900/20";
      case "lavender":
        return "bg-purple-50/50 dark:bg-purple-900/20";
      case "rose":
        return "bg-rose-50/50 dark:bg-rose-900/20";
      case "sepia":
        return "bg-amber-100/50 dark:bg-amber-900/20";
      default:
        return "bg-amber-50/50 dark:bg-amber-900/20";
    }
  };

  const accentColor = getAccentColor();
  const hoverBgColor = getHoverBgColor();
  const borderColor = getBorderColor();
  const iconBgColor = getIconBgColor();
  const unreadBgColor = getUnreadBgColor();

  // Handle click outside to close
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

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const markAsRead = (id) => {
    setLocalNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
    if (onNotificationClick) onNotificationClick(id);
  };

  const markAllAsRead = () => {
    setLocalNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true })),
    );
    if (onMarkAllRead) onMarkAllRead();
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
      {/* Notification Bell Button */}
      <button
        onClick={toggleDropdown}
        className={`p-2 ${accentColor} ${hoverBgColor} rounded-full transition-all relative group`}
        aria-label="Notifications"
      >
        <FaBell size={18} />
        {showCount && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full animate-pulse">
            {unreadCount}
          </span>
        )}
        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
          Notifications
        </span>
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <div
          className={`absolute ${positionClasses[position]} mt-2 ${width} ${theme.background.card} rounded-2xl shadow-xl border ${borderColor} py-2 z-50`}
        >
          {/* Header */}
          <div
            className={`px-4 py-2 text-sm font-semibold ${accentColor} border-b ${borderColor} flex justify-between items-center`}
          >
            <div className="flex items-center gap-2">
              <FaBell className={accentColor} />
              <span>Notifications</span>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className={`text-xs ${accentColor} hover:underline`}
                >
                  Mark all read
                </button>
              )}
              {localNotifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                  title="Clear all"
                >
                  <FaTimes size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          {localNotifications.length === 0 ? (
            <div className={`px-4 py-8 text-center ${theme.text.tertiary}`}>
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
                    className={`block px-4 py-3 ${hoverBgColor} cursor-pointer transition ${
                      !notif.read ? unreadBgColor : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full ${iconBgColor} flex items-center justify-center ${notif.iconColor}`}
                      >
                        <Icon size={16} />
                      </div>

                      {/* Content */}
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

                      {/* Unread indicator */}
                      {!notif.read && (
                        <div
                          className={`w-2 h-2 ${accentColor.replace("text", "bg")} rounded-full mt-1`}
                        ></div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Footer */}
          {localNotifications.length > 0 && (
            <div className={`px-4 py-2 text-center border-t ${borderColor}`}>
              <Link
                to="/notifications"
                className={`text-sm ${accentColor} hover:underline`}
                onClick={() => setIsOpen(false)}
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

// Optional: Separate component for the notifications page
export const NotificationsPage = () => {
  const [allNotifications, setAllNotifications] = useState(sampleNotifications);
  const { theme, themeName } = useTheme();

  const markAsRead = (id) => {
    setAllNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
  };

  const markAllAsRead = () => {
    setAllNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true })),
    );
  };

  const deleteNotification = (id) => {
    setAllNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const unreadCount = allNotifications.filter((n) => !n.read).length;

  // Theme-based styling
  const getAccentGradient = () => {
    switch (themeName) {
      case "forest":
        return "from-green-600 to-emerald-600";
      case "lavender":
        return "from-purple-600 to-pink-600";
      case "rose":
        return "from-rose-600 to-pink-600";
      case "sepia":
        return "from-amber-600 to-yellow-700";
      default:
        return "from-amber-600 to-yellow-600";
    }
  };

  const getBorderColor = () => {
    switch (themeName) {
      case "forest":
        return "divide-green-100 dark:divide-green-800";
      case "lavender":
        return "divide-purple-100 dark:divide-purple-800";
      case "rose":
        return "divide-rose-100 dark:divide-rose-800";
      case "sepia":
        return "divide-amber-200 dark:divide-amber-700";
      default:
        return "divide-amber-100 dark:divide-amber-800";
    }
  };

  const getUnreadBgColor = () => {
    switch (themeName) {
      case "forest":
        return "bg-green-50/30 dark:bg-green-900/20";
      case "lavender":
        return "bg-purple-50/30 dark:bg-purple-900/20";
      case "rose":
        return "bg-rose-50/30 dark:bg-rose-900/20";
      case "sepia":
        return "bg-amber-100/30 dark:bg-amber-900/20";
      default:
        return "bg-amber-50/30 dark:bg-amber-900/20";
    }
  };

  const accentGradient = getAccentGradient();
  const borderColor = getBorderColor();
  const unreadBgColor = getUnreadBgColor();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          <span
            className={`bg-gradient-to-r ${accentGradient} bg-clip-text text-transparent`}
          >
            Notifications
          </span>
        </h1>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className={`${theme.text.accent} hover:underline text-sm font-medium`}
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Stats */}
      <div
        className={`${theme.background.card} rounded-2xl shadow-lg p-6 mb-8 border ${theme.border.card}`}
      >
        <div className="flex items-center justify-around">
          <div className="text-center">
            <div className={`text-2xl font-bold ${theme.text.accent}`}>
              {allNotifications.length}
            </div>
            <div className={`text-xs ${theme.text.tertiary}`}>Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {unreadCount}
            </div>
            <div className={`text-xs ${theme.text.tertiary}`}>Unread</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${theme.text.primary}`}>
              {allNotifications.length - unreadCount}
            </div>
            <div className={`text-xs ${theme.text.tertiary}`}>Read</div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div
        className={`${theme.background.card} rounded-2xl shadow-lg overflow-hidden border ${theme.border.card}`}
      >
        {allNotifications.length === 0 ? (
          <div className="text-center py-16">
            <FaCheckCircle className="text-5xl text-green-400 mx-auto mb-4" />
            <h3 className={`text-xl font-semibold ${theme.text.primary} mb-2`}>
              All caught up!
            </h3>
            <p className={theme.text.tertiary}>
              You have no notifications at the moment
            </p>
          </div>
        ) : (
          <div className={`divide-y ${borderColor}`}>
            {allNotifications.map((notif) => {
              const Icon = notif.icon;
              return (
                <div
                  key={notif.id}
                  className={`p-6 ${!notif.read ? unreadBgColor : ""}`}
                >
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-full ${theme.background.secondary} flex items-center justify-center ${notif.iconColor}`}
                    >
                      <Icon size={20} />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className={`font-semibold ${theme.text.primary}`}>
                          {notif.message}
                        </h3>
                        <span className={`text-xs ${theme.text.light}`}>
                          {notif.time}
                        </span>
                      </div>
                      {notif.description && (
                        <p className={`text-sm ${theme.text.secondary} mb-3`}>
                          {notif.description}
                        </p>
                      )}
                      <div className="flex gap-3">
                        {notif.link && (
                          <Link
                            to={notif.link}
                            className={`text-xs ${theme.text.accent} hover:underline font-medium`}
                          >
                            View Details →
                          </Link>
                        )}
                        {!notif.read && (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            className={`text-xs ${theme.text.tertiary} hover:${theme.text.primary}`}
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="text-xs text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Unread indicator */}
                    {!notif.read && (
                      <div
                        className={`w-3 h-3 ${theme.text.accent.replace("text", "bg")} rounded-full mt-2`}
                      ></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;
