import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface IComment {
    user: any;
    question: string;
    question_replies: IComment[];
}

export interface IReview {
    user: any;
    rating?: number;
    comment: string;
    comment_replies?: IReview[];
}

export interface ILink {
    title: string;
    url: string;
    public_id?: string;
    source: "url" | "file";
}

export interface IAnswers {
    answer: string;
    is_correct: boolean;
}

export interface IQuestions {
    question: string;
    answers: IAnswers[];
}

export interface ITest {
    duration: number;
    questions: IQuestions[];
}

export interface ICourseData {
    id?: string;
    title: string;
    description: string;
    video_url: string;
    video_thumbnail: object;
    video_section: string;
    video_length: number;
    video_player: string;
    links: ILink[];
    suggestion: string;
}

export interface Course {
    id: string;
    name: string;
    description: string;
    short_description: string;
    categories: string;
    price: number;
    estimated_price?: number;
    thumbnail: {
        public_id: string;
        url: string;
    };
    tags: string;
    level: string;
    demo_url: string;
    benefits: { title: string }[];
    prerequisites: { title: string }[];
    course_data: ICourseData[];
    reviews: IReview[];
    ratings?: number;
    purchased: number;
    creator: any;
    status: boolean;
    ready: boolean;
    url: string;
    test: ITest;
    fake_user: number;
    display_order: number;
    created_at?: string;
}

interface CourseData {
    courses: Course[];
    currentCourse: Course | null;
    isLoading: boolean;
    error: string | null;
}

interface CourseActions {
    createCourse: (data: Partial<Course>, token: string) => Promise<void>;
    getAllCourses: (token: string) => Promise<void>;
    getPublicCourses: () => Promise<void>;
    getCourseById: (id: string, token: string) => Promise<void>;
    getPublicCourseById: (id: string) => Promise<void>;
    updateCourse: (id: string, data: Partial<Course>, token: string) => Promise<void>;
    deleteCourse: (id: string, token: string) => Promise<void>;
    clearError: () => void;
    clearCurrentCourse: () => void;
}

export type CourseStore = CourseData & CourseActions;

const API_URL = 'http://localhost:5000/api/courses';

export const useCourseStore = create<CourseStore>()(
    persist(
        (set, get) => ({
            // State
            courses: [],
            currentCourse: null,
            isLoading: false,
            error: null,

            // Actions
            clearError: () => set({ error: null }),
            clearCurrentCourse: () => set({ currentCourse: null }),

            createCourse: async (courseData, token) => {
                set({ isLoading: true, error: null });
                try {
                    const res = await fetch(`${API_URL}/create-course`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(courseData),
                    });

                    const data = await res.json();
                    if (!res.ok) {
                        throw new Error(data.error || 'Failed to create course');
                    }

                    await get().getAllCourses(token);
                    set({ isLoading: false });
                } catch (err: any) {
                    set({ error: err.message, isLoading: false });
                }
            },

            getAllCourses: async (token) => {
                set({ isLoading: true, error: null });
                try {
                    const res = await fetch(`${API_URL}/get-admin-courses`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    const data = await res.json();
                    if (!res.ok) {
                        throw new Error(data.error || 'Failed to fetch courses');
                    }

                    set({ courses: data.courses || [], isLoading: false });
                } catch (err: any) {
                    set({ error: err.message, isLoading: false });
                }
            },

            getPublicCourses: async () => {
                set({ isLoading: true, error: null });
                try {
                    const res = await fetch(`${API_URL}/get-courses`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    const data = await res.json();
                    if (!res.ok) {
                        throw new Error(data.error || 'Failed to fetch courses');
                    }

                    set({ courses: data.courses || [], isLoading: false });
                } catch (err: any) {
                    set({ error: err.message, isLoading: false });
                }
            },

            getCourseById: async (id, token) => {
                set({ isLoading: true, error: null });
                try {
                    const res = await fetch(`${API_URL}/get-course-id/${id}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    const data = await res.json();
                    if (!res.ok) {
                        throw new Error(data.error || 'Course not found');
                    }

                    set({ currentCourse: data.course, isLoading: false });
                } catch (err: any) {
                    set({ error: err.message, isLoading: false });
                }
            },

            getPublicCourseById: async (id) => {
                set({ isLoading: true, error: null });
                try {
                    const res = await fetch(`${API_URL}/get-course/${id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    const data = await res.json();
                    if (!res.ok) {
                        throw new Error(data.error || 'Course not found');
                    }

                    set({ currentCourse: data.course, isLoading: false });
                } catch (err: any) {
                    set({ error: err.message, isLoading: false });
                }
            },

            updateCourse: async (id, courseData, token) => {
                set({ isLoading: true, error: null });
                try {
                    const res = await fetch(`${API_URL}/edit-course/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(courseData),
                    });

                    const data = await res.json();
                    if (!res.ok) {
                        throw new Error(data.error || 'Failed to update course');
                    }

                    await get().getAllCourses(token);
                    set({ currentCourse: data.course, isLoading: false });
                } catch (err: any) {
                    set({ error: err.message, isLoading: false });
                }
            },

            deleteCourse: async (id, token) => {
                set({ isLoading: true, error: null });
                try {
                    const res = await fetch(`${API_URL}/delete-course/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    const data = await res.json();
                    if (!res.ok) {
                        throw new Error(data.error || 'Failed to delete course');
                    }

                    set((state) => ({
                        courses: state.courses.filter((c) => c.id !== id),
                        isLoading: false,
                    }));
                } catch (err: any) {
                    set({ error: err.message, isLoading: false });
                }
            },
        }),
        {
            name: 'benaa-course-storage',
            partialize: (state) => ({
                courses: state.courses,
            }),
        }
    )
);
