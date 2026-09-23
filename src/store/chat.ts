import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { SOCKET_URL, API_ENDPOINTS } from '@/config/api';
import { authenticatedFetch } from '@/lib/api';
import { useNotificationStore } from '@/store/notification';
import { useAuthStore } from '@/store/auth';
import { toast } from 'sonner';

export interface ChatSender {
  id: string;
  name: string;
  avatar?: string;
  role: string;
}

export interface ChatMessageItem {
  id: string;
  courseId: string;
  sender: ChatSender;
  message: string;
  createdAt: string;
}

export interface OnlineUser {
  id: string;
  name: string;
  avatar?: string;
  role: string;
}

interface ChatState {
  socket: Socket | null;
  currentToken: string | null;
  currentCourseId: string | null;
  messages: ChatMessageItem[];
  onlineCount: number;
  onlineUsers: OnlineUser[];
  typingUsers: { id: string; name: string }[];
  isConnected: boolean;
  isLoadingHistory: boolean;
  error: string | null;
  unreadCount: number;

  // Actions
  initializeSocket: (token: string) => void;
  joinCourseRoom: (courseId: string) => void;
  leaveCourseRoom: () => void;
  fetchMessageHistory: (courseId: string, token: string) => Promise<void>;
  sendMessage: (text: string) => void;
  setTyping: (isTyping: boolean) => void;
  deleteMessage: (messageId: string, token: string) => Promise<void>;
  resetUnreadCount: () => void;
  disconnectSocket: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  socket: null,
  currentToken: null,
  currentCourseId: null,
  messages: [],
  onlineCount: 1,
  onlineUsers: [],
  typingUsers: [],
  isConnected: false,
  isLoadingHistory: false,
  error: null,
  unreadCount: 0,

  initializeSocket: (token: string) => {
    const existingSocket = get().socket;
    const currentToken = get().currentToken;

    // If socket is already connected with the exact same user token, avoid reconnecting
    if (existingSocket && existingSocket.connected && currentToken === token) {
      return;
    }

    if (existingSocket) {
      existingSocket.disconnect();
    }

    const socketInstance: Socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socketInstance.on('connect', () => {
      set({ isConnected: true, error: null });
      const currentCourseId = get().currentCourseId;
      if (currentCourseId) {
        socketInstance.emit('join_course_room', { courseId: currentCourseId });
      }
    });

    socketInstance.on('disconnect', () => {
      set({ isConnected: false });
    });

    socketInstance.on('connect_error', (err) => {
      set({ isConnected: false, error: err.message });
    });

    socketInstance.on('new_message', (message: ChatMessageItem) => {
      const state = get();
      if (message.courseId === state.currentCourseId) {
        set((prev) => ({
          messages: [...prev.messages, message],
        }));
      }
    });

    socketInstance.on('room_users_updated', ({ count, users }: { count: number; users: OnlineUser[] }) => {
      set({ onlineCount: count || 1, onlineUsers: users || [] });
    });

    socketInstance.on('user_typing', ({ user, isTyping }: { user: { id: string; name: string }; isTyping: boolean }) => {
      set((prev) => {
        if (isTyping) {
          const exists = prev.typingUsers.some((u) => u.id === user.id);
          if (exists) return prev;
          return { typingUsers: [...prev.typingUsers, user] };
        }
        return { typingUsers: prev.typingUsers.filter((u) => u.id !== user.id) };
      });
    });

    socketInstance.on('error_message', ({ message }: { message: string }) => {
      set({ error: message });
    });

    // Real-time Chat Notifications
    socketInstance.on('new_chat_notification', (data: {
      id: string;
      courseId: string;
      courseName: string;
      link: string;
      sender: {
        id: string;
        name: string;
        role: string;
        roleLabel: string;
      };
      message: string;
      createdAt: string;
    }) => {
      console.log('[Socket Frontend] Received new_chat_notification:', data);
      const state = get();
      // If user is already active in that exact course chatroom, don't nag with notifications
      if (state.currentCourseId === data.courseId) {
        return;
      }

      const currentUser = useAuthStore.getState().user;
      const targetUserId = currentUser?.id || "all";

      // Add to persistent notification store
      useNotificationStore.getState().addNotification({
        userId: targetUserId,
        title: `رسالة جديدة من ${data.sender.name} (${data.sender.roleLabel})`,
        message: `${data.courseName}: ${data.message}`,
        type: "chat_message",
        link: data.link,
        sender: data.sender,
        courseName: data.courseName,
      });

      // Show real-time interactive toast alert
      toast.info(`رسالة جديدة في ${data.courseName}`, {
        description: `${data.sender.name}: ${data.message}`,
        action: {
          label: "عرض",
          onClick: () => {
            window.location.href = data.link;
          },
        },
      });
    });

    set({ socket: socketInstance, currentToken: token });
  },

  joinCourseRoom: (courseId: string) => {
    const socket = get().socket;
    set({ currentCourseId: courseId, messages: [], typingUsers: [], error: null });

    if (socket && socket.connected) {
      socket.emit('join_course_room', { courseId });
    }
  },

  leaveCourseRoom: () => {
    const { socket, currentCourseId } = get();
    if (socket && currentCourseId) {
      socket.emit('leave_course_room', { courseId: currentCourseId });
    }
    set({ currentCourseId: null, messages: [], typingUsers: [], onlineCount: 1 });
  },

  fetchMessageHistory: async (courseId: string, token: string) => {
    set({ isLoadingHistory: true, error: null });
    try {
      const res = await authenticatedFetch(`${API_ENDPOINTS.chat}/${courseId}/messages`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to load chat history');
      }

      set({
        messages: data.messages || [],
        isLoadingHistory: false,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error fetching messages';
      set({ error: message, isLoadingHistory: false });
    }
  },

  sendMessage: (text: string) => {
    const { socket, currentCourseId } = get();
    if (!socket || !socket.connected || !currentCourseId || !text.trim()) {
      return;
    }

    socket.emit('send_message', {
      courseId: currentCourseId,
      message: text.trim(),
    });
  },

  setTyping: (isTyping: boolean) => {
    const { socket, currentCourseId } = get();
    if (!socket || !socket.connected || !currentCourseId) {
      return;
    }

    socket.emit('typing', {
      courseId: currentCourseId,
      isTyping,
    });
  },

  deleteMessage: async (messageId: string, token: string) => {
    const { currentCourseId } = get();
    if (!currentCourseId) return;

    try {
      const res = await authenticatedFetch(`${API_ENDPOINTS.chat}/${currentCourseId}/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        set((prev) => ({
          messages: prev.messages.filter((m) => m.id !== messageId),
        }));
      }
    } catch (err) {
      console.error('Delete message error:', err);
    }
  },

  resetUnreadCount: () => {
    set({ unreadCount: 0 });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
    }
    set({
      socket: null,
      currentToken: null,
      isConnected: false,
      currentCourseId: null,
      messages: [],
      typingUsers: [],
      onlineUsers: [],
      onlineCount: 1,
      unreadCount: 0,
    });
  },
}));
