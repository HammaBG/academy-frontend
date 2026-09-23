"use client";

import { useEffect, useRef, useState, useCallback, useTransition } from "react";
import { useChatStore } from "@/store/chat";
import { useAuthStore } from "@/store/auth";
import {
  Send,
  Loader2,
  Users,
  MessageSquare,
  ShieldCheck,
  User as UserIcon,
  Sparkles,
  Wifi,
  WifiOff,
  Trash2,
  Smile
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseChatRoomProps {
  courseId: string;
  courseName: string;
  instructorId?: string;
}

export function CourseChatRoom({ courseId, courseName, instructorId }: CourseChatRoomProps) {
  const { token, user } = useAuthStore();
  const {
    messages,
    onlineCount,
    typingUsers,
    isConnected,
    isLoadingHistory,
    error,
    initializeSocket,
    joinCourseRoom,
    leaveCourseRoom,
    fetchMessageHistory,
    sendMessage,
    setTyping,
    deleteMessage
  } = useChatStore();

  const [inputMessage, setInputMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize and connect socket on mount
  useEffect(() => {
    if (token) {
      initializeSocket(token);
      joinCourseRoom(courseId);
      fetchMessageHistory(courseId, token);
    }

    return () => {
      leaveCourseRoom();
    };
  }, [token, courseId, initializeSocket, joinCourseRoom, leaveCourseRoom, fetchMessageHistory]);

  // Auto-scroll messages container internally without scrolling the entire page
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, typingUsers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);

    // Broadcast typing indicator
    setTyping(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
    }, 1500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    sendMessage(inputMessage);
    setInputMessage("");
    setTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleAddEmoji = (emoji: string) => {
    setInputMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const isUserInstructor = user?.role === "admin" || (user?.role === "instructor" && instructorId === user?.id);

  const quickEmojis = ["👍", "🔥", "❤️", "👏", "🎯", "💡", "❓", "🚀"];

  return (
    <div className="flex flex-col h-[650px] bg-surface border border-border/50 rounded-[32px] overflow-hidden shadow-xl text-right select-none" dir="rtl">
      {/* Top Header */}
      <div className="px-6 py-4 border-b border-border/40 bg-surface-secondary/20 backdrop-blur-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-text-primary">غرفة محادثة الدورة المباشرة</h3>
              <span className="flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                <Sparkles className="w-3 h-3" />
                مباشر
              </span>
            </div>
            <p className="text-xs font-semibold text-text-secondary truncate max-w-[250px] sm:max-w-md">
              {courseName}
            </p>
          </div>
        </div>

        {/* Online Students Badge & Connection Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface border border-border/50 shadow-xs">
            <span className="relative flex h-2.5 w-2.5">
              {isConnected ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
              )}
            </span>
            <span className="text-xs font-black text-text-primary">
              {onlineCount} {onlineCount === 1 ? "طالب متصل" : "طلاب متصلين"}
            </span>
          </div>

          <div className="hidden sm:flex items-center text-text-secondary/60 text-xs">
            {isConnected ? (
              <span title="متصل بالخادم">
                <Wifi className="w-4 h-4 text-emerald-500" />
              </span>
            ) : (
              <span title="جاري الاتصال...">
                <WifiOff className="w-4 h-4 text-amber-500" />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Messages Stream Area */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-background/30">
        {isLoadingHistory ? (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-text-secondary">
            <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
            <p className="text-xs font-bold">جاري تحميل رسائل الدورة...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-text-secondary/60">
            <div className="w-16 h-16 rounded-3xl bg-brand-primary/10 flex items-center justify-center mb-4 text-brand-primary">
              <Users className="w-8 h-8" />
            </div>
            <h4 className="text-base font-black text-text-primary mb-1">لا توجد رسائل بعد في غرفة الدورة</h4>
            <p className="text-xs font-semibold max-w-sm">
              ابدأ المحادثة الآن، وتبادل الأسئلة والخبرات مع زملائك والمدرب في نفس الوقت!
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender?.id === user?.id;
            const isMsgInstructor = msg.sender?.role === "instructor" || msg.sender?.role === "admin";

            return (
              <div
                key={msg.id}
                className={cn(
                  "flex items-start gap-3 group transition-all",
                  isMe ? "flex-row" : "flex-row"
                )}
              >
                {/* Sender Avatar */}
                <div className="w-9 h-9 rounded-full bg-surface border border-border/40 overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                  {msg.sender?.avatar ? (
                    <img src={msg.sender.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-4 h-4 text-text-secondary/40" />
                  )}
                </div>

                {/* Message Bubble & Meta */}
                <div className={cn("flex flex-col max-w-[82%] sm:max-w-[70%]", isMe ? "items-start" : "items-start")}>
                  {/* Sender Name & Badges */}
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className={cn("text-xs font-extrabold", isMe ? "text-brand-primary" : "text-text-primary")}>
                      {isMe ? "أنت" : msg.sender?.name}
                    </span>

                    {isMsgInstructor && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 border border-amber-500/20">
                        <ShieldCheck className="w-3 h-3" />
                        مدرب الدورة
                      </span>
                    )}

                    <span className="text-[10px] text-text-secondary/50 font-medium">
                      {msg.createdAt
                        ? new Date(msg.createdAt).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })
                        : ""}
                    </span>

                    {/* Delete Message Button for owner / instructor */}
                    {(isMe || isUserInstructor) && token && (
                      <button
                        onClick={() => deleteMessage(msg.id, token)}
                        className="opacity-0 group-hover:opacity-100 hover:text-red-500 text-text-secondary/40 p-1 transition-opacity"
                        title="حذف الرسالة"
                        aria-label="حذف الرسالة"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Message Bubble Content */}
                  <div
                    className={cn(
                      "p-3.5 sm:p-4 rounded-2xl text-sm font-semibold leading-relaxed shadow-sm break-words whitespace-pre-wrap select-text",
                      isMe
                        ? "bg-brand-primary text-white rounded-tr-none"
                        : isMsgInstructor
                        ? "bg-amber-500/10 border border-amber-500/25 text-text-primary rounded-tr-none"
                        : "bg-surface border border-border/40 text-text-primary rounded-tr-none"
                    )}
                  >
                    {msg.message}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Live Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2 text-xs font-bold text-text-secondary/70 animate-pulse px-2 py-1">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce" />
            </div>
            <span>
              {typingUsers.map((u) => u.name).join(", ")} {typingUsers.length === 1 ? "يكتب الآن..." : "يكتبون الآن..."}
            </span>
          </div>
        )}

      </div>

      {/* Quick Emojis Bar (if emoji open) */}
      {showEmojiPicker && (
        <div className="px-4 py-2 bg-surface border-t border-border/30 flex items-center gap-2 overflow-x-auto">
          {quickEmojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleAddEmoji(emoji)}
              className="text-lg hover:scale-125 transition-transform p-1"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Bottom Message Input Bar */}
      <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-surface border-t border-border/40 flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className={cn(
            "p-2.5 rounded-xl border transition-colors",
            showEmojiPicker
              ? "bg-brand-primary/10 border-brand-primary text-brand-primary"
              : "bg-background border-border/40 hover:border-brand-primary/40 text-text-secondary"
          )}
          aria-label="إدراج رمز تعبيري"
        >
          <Smile className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={inputMessage}
          onChange={handleInputChange}
          placeholder="شارك برأيك أو اطرح سؤالاً مع زملائك بالدورة..."
          className="flex-1 bg-background/50 border border-border/50 focus:border-brand-primary/70 px-4 py-3 rounded-2xl text-sm font-semibold text-text-primary outline-none transition-all placeholder:text-text-secondary/40 text-right"
          maxLength={2000}
        />

        <button
          type="submit"
          disabled={!inputMessage.trim() || !isConnected}
          className="px-5 py-3 bg-brand-primary hover:bg-brand-primary/95 disabled:opacity-40 disabled:pointer-events-none text-white rounded-2xl font-extrabold text-sm flex items-center gap-2 shadow-md shadow-brand-primary/15 transition-all hover:scale-[1.02] active:scale-[0.98]"
          aria-label="إرسال"
        >
          <span>إرسال</span>
          <Send className="w-4 h-4 rotate-180" />
        </button>
      </form>
    </div>
  );
}
