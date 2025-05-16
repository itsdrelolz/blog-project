// Default to the production URL, but allow override through environment variable
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://blog-project-9n6u.onrender.com';

// Helper function to build API URLs
export const buildApiUrl = (path: string): string => {
    return `${API_BASE_URL}${path}`;
}; 