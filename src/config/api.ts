const LOCAL_API_URL = "http://localhost:5000/api";
const PROD_API_URL = "https://academy-backend-8gl3.onrender.com/api";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "development" ? LOCAL_API_URL : PROD_API_URL);

export const API_ENDPOINTS = {
  auth: `${API_BASE_URL}/auth`,
  courses: `${API_BASE_URL}/courses`,
  articles: `${API_BASE_URL}/articles`,
  categories: `${API_BASE_URL}/categories`,
  forms: `${API_BASE_URL}/forms`,
  enrollmentCodes: `${API_BASE_URL}/enrollment-codes`,
  wishlist: `${API_BASE_URL}/wishlist`,
};
