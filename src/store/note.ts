import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LessonNote {
  id: string;
  userId: string;
  courseId: string;
  sectionId: string;
  timestampSeconds: number;
  timeFormatted: string;
  text: string;
  createdAt: string;
}

interface NoteState {
  notes: LessonNote[];
  addNote: (note: Omit<LessonNote, "id" | "createdAt">) => void;
  deleteNote: (id: string) => void;
  getLessonNotes: (userId: string, courseId: string, sectionId: string) => LessonNote[];
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

      addNote: (newNote) => {
        const item: LessonNote = {
          ...newNote,
          id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          notes: [item, ...state.notes],
        }));
      },

      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        }));
      },

      getLessonNotes: (userId, courseId, sectionId) => {
        return get().notes.filter(
          (n) => n.userId === userId && n.courseId === courseId && n.sectionId === sectionId
        );
      },
    }),
    {
      name: "ossos-lesson-notes-storage",
    }
  )
);
