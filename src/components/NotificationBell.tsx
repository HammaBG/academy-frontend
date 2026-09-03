"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNotificationStore } from "@/store/notification";
import { useAuthStore } from "@/store/auth";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  MessageSquare,
  Award,
  Ticket,
  Info,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

function getRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "الآن";
  if (diffInSeconds < 3600) return `منذ ${Math.floor(diffInSeconds / 60)} دقيقة`;
  if (diffInSeconds < 86400) return `منذ ${Math.floor(diffInSeconds / 3600)} ساعة`;
  if (diffInSeconds < 604800) return `منذ ${Math.floor(diffInSeconds / 86400)} يوم`;
  return date.toLocaleDateString("ar-TN");
}

export function NotificationBell() {
  const router = useRouter();
  const { user } = useAuthStore();
  const userId = user?.id;
  const {
    getUserNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationStore();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const notifications = getUserNotifications(userId);
  const unreadCount = getUnreadCount(userId);

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    return true;
  });

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "qa_reply":
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case "certificate":
        return <Award className="w-4 h-4 text-[#F95353]" />;
      case "course_activation":
        return <Ticket className="w-4 h-4 text-emerald-500" />;
      default:
        return <Info className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="relative inline-block " ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-2xl bg-surface hover:bg-surface/80 border border-border/40 text-text-primary transition-all duration-300 shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
        aria-label="الإشعارات"
      >
        <Bell className="w-5 h-5" />

        {/* Unread Badge Counter */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 bg-[#F95353] text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-background shadow-sm animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Popover */}
      {isOpen && (
        <div
          className="absolute left-0 top-full mt-3 w-[90vw] sm:w-[380px] max-w-[380px] bg-surface border border-border/40 rounded-3xl shadow-2xl overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200 text-right"
          dir="rtl"
        >
          {/* Top Header */}
          <div className="p-4 px-5 border-b border-border/40 bg-surface/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-black text-base text-text-primary">الإشعارات</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-[#F95353]/15 text-[#F95353] text-[11px] font-extrabold rounded-full">
                  {unreadCount} جديد
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] font-bold text-text-secondary hover:text-brand-primary flex items-center gap-1 transition-colors cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>قراءة الكل</span>
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-border/30 px-3 pt-2 bg-surface/30">
            <button
              onClick={() => setFilter("all")}
              className={cn(
                "pb-2.5 px-4 text-xs font-extrabold transition-all border-b-2 cursor-pointer",
                filter === "all"
                  ? "border-[#F95353] text-[#F95353]"
                  : "border-transparent text-text-secondary hover:text-text-primary"
              )}
            >
              الكل ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={cn(
                "pb-2.5 px-4 text-xs font-extrabold transition-all border-b-2 cursor-pointer",
                filter === "unread"
                  ? "border-[#F95353] text-[#F95353]"
                  : "border-transparent text-text-secondary hover:text-text-primary"
              )}
            >
              غير مقروء ({unreadCount})
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-border/20">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <Bell className="w-10 h-10 text-text-secondary/30 mx-auto" />
                <p className="text-xs font-bold text-text-secondary">لا توجد إشعارات حالياً</p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    markAsRead(notif.id);
                    if (notif.link) {
                      router.push(notif.link);
                      setIsOpen(false);
                    }
                  }}
                  className={cn(
                    "p-4 flex items-start gap-3 transition-all duration-200 cursor-pointer group hover:bg-surface/80",
                    !notif.isRead && "bg-[#F95353]/5"
                  )}
                >
                  {/* Category Icon Container */}
                  <div className="w-9 h-9 rounded-xl bg-surface border border-border/40 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    {getNotificationIcon(notif.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="text-xs font-black text-text-primary truncate">
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-text-secondary/70 font-semibold shrink-0">
                        {getRelativeTime(notif.createdAt)}
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-text-secondary line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!notif.isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notif.id);
                        }}
                        className="p-1 text-text-secondary hover:text-emerald-500 rounded-md"
                        title="تعليم كمقروء"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notif.id);
                      }}
                      className="p-1 text-text-secondary hover:text-red-500 rounded-md"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
