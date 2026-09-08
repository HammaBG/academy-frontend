import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createSafeStorage } from "@/lib/storage";
import { API_ENDPOINTS } from "@/config/api";

export interface LessonNote {
  id: string;
  userId: string;
  courseId: string;
  courseName: string;
  sectionId: string;
  sectionTitle: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  timestampSeconds: number;
  timeFormatted: string;
  text: string;
  createdAt: string;
}

interface NoteState {
  notes: LessonNote[];
  isLoading: boolean;
  error: string | null;
  addNote: (
    note: Omit<LessonNote, "id" | "createdAt">,
    token?: string | null
  ) => Promise<LessonNote>;
  deleteNote: (id: string, token?: string | null) => Promise<void>;
  fetchUserNotes: (token: string) => Promise<void>;
  getUserNotes: (userId: string) => LessonNote[];
  getLessonNotes: (
    userId: string,
    courseId: string,
    sectionId: string
  ) => LessonNote[];
}

export function formatVideoTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export const useNoteStore = create<NoteState>()(
  persist(
    (set, get) => ({
      notes: [],
      isLoading: false,
      error: null,

      fetchUserNotes: async (token: string) => {
        if (!token) return;
        set({ isLoading: true, error: null });
        try {
          const res = await fetch(API_ENDPOINTS.notes, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (res.ok) {
            const data = await res.json();
            if (data.success && Array.isArray(data.notes)) {
              // Map DB notes to frontend interface
              const fetchedNotes: LessonNote[] = data.notes.map((n: any) => ({
                id: n._id || n.id,
                userId: n.user_id || n.userId,
                courseId: n.course_id || n.courseId,
                courseName: n.course_name || n.courseName || "دورة تعليمية",
                sectionId: n.section_id || n.sectionId,
                sectionTitle: n.section_title || n.sectionTitle || "درس",
                videoUrl: n.video_url || n.videoUrl || "",
                thumbnailUrl: n.thumbnail_url || n.thumbnailUrl || "",
                timestampSeconds: n.timestamp_seconds ?? n.timestampSeconds ?? 0,
                timeFormatted: n.time_formatted || n.timeFormatted || formatVideoTime(n.timestamp_seconds ?? 0),
                text: n.text,
                createdAt: n.createdAt || n.created_at || new Date().toISOString(),
              }));

              set({ notes: fetchedNotes, isLoading: false });
              return;
            }
          }
        } catch (_err) {
          // Fallback to local storage
        }
        set({ isLoading: false });
      },

      addNote: async (newNote, token) => {
        const tempId = `note-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const localItem: LessonNote = {
          ...newNote,
          id: tempId,
          createdAt: new Date().toISOString(),
        };

        // Optimistic update
        set((state) => ({
          notes: [localItem, ...state.notes],
        }));

        if (token) {
          try {
            const res = await fetch(API_ENDPOINTS.notes, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                courseId: newNote.courseId,
                courseName: newNote.courseName,
                sectionId: newNote.sectionId,
                sectionTitle: newNote.sectionTitle,
                videoUrl: newNote.videoUrl || "",
                thumbnailUrl: newNote.thumbnailUrl || "",
                timestampSeconds: newNote.timestampSeconds,
                timeFormatted: newNote.timeFormatted,
                text: newNote.text,
              }),
            });

            if (res.ok) {
              const data = await res.json();
              if (data.success && data.note) {
                const dbNote: LessonNote = {
                  id: data.note._id || data.note.id,
                  userId: data.note.user_id || newNote.userId,
                  courseId: data.note.course_id || newNote.courseId,
                  courseName: data.note.course_name || newNote.courseName,
                  sectionId: data.note.section_id || newNote.sectionId,
                  sectionTitle: data.note.section_title || newNote.sectionTitle,
                  videoUrl: data.note.video_url || newNote.videoUrl || "",
                  thumbnailUrl: data.note.thumbnail_url || newNote.thumbnailUrl || "",
                  timestampSeconds: data.note.timestamp_seconds ?? newNote.timestampSeconds,
                  timeFormatted: data.note.time_formatted || newNote.timeFormatted,
                  text: data.note.text,
                  createdAt: data.note.createdAt || localItem.createdAt,
                };

                set((state) => ({
                  notes: state.notes.map((n) => (n.id === tempId ? dbNote : n)),
                }));

                return dbNote;
              }
            }
          } catch (_err) {
            // Keep local note
          }
        }

        return localItem;
      },

      deleteNote: async (id, token) => {
        // Optimistic delete
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        }));

        if (token) {
          try {
            await fetch(`${API_ENDPOINTS.notes}/${id}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });
          } catch (_err) {
            // Handled
          }
        }
      },

      getUserNotes: (userId) => {
        return get().notes.filter(
          (n) => n.userId === userId || userId === "guest"
        );
      },

      getLessonNotes: (userId, courseId, sectionId) => {
        return get().notes.filter(
          (n) =>
            (n.userId === userId || userId === "guest") &&
            n.courseId === courseId &&
            n.sectionId === sectionId
        );
      },
    }),
    {
      name: "ossos-lesson-notes-storage",
      storage: createJSONStorage(() => createSafeStorage()),
    }
  )
);
