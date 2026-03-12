import axios, { AxiosError } from "axios";
import { authService } from "./auth";
import toast from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor - add auth token
api.interceptors.request.use(
    (config) => {
        const token = authService.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<any>) => {
        if (error.response?.status === 401) {
            // Unauthorized - logout and redirect
            authService.logout();
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
            toast.error("Session expired. Please login again.");
        } else if (error.response?.status === 403) {
            toast.error("Access denied. Insufficient permissions.");
        } else if (error.response?.status === 423) {
            toast.error("Account locked. Please try again later.");
        } else if (error.response?.status === 429) {
            toast.error("Too many requests. Please slow down.");
        } else if (error.response?.data?.error) {
            toast.error(error.response.data.error);
        } else {
            toast.error("An error occurred. Please try again.");
        }
        return Promise.reject(error);
    }
);

// API methods
export const apiClient = {
    // Auth
    login: (email: string, password: string) =>
        api.post("/api/auth/login", { email, password }),

    register: (data: { name: string; email: string; phone?: string; password: string }) =>
        api.post("/api/auth/register", data),

    getProfile: () => api.get("/api/auth/me"),

    changePassword: (currentPassword: string, newPassword: string) =>
        api.post("/api/auth/change-password", { currentPassword, newPassword }),

    logout: () => api.post("/api/auth/logout"),

    // Organizations
    createOrganization: (data: any) => api.post("/api/organizations", data),

    getOrganizations: () => api.get("/api/organizations"),

    getOrganization: (id: string) => api.get(`/api/organizations/${id}`),

    switchOrganization: (id: string) => api.post(`/api/organizations/${id}/switch`),

    createWorkspace: (organizationId: string, data: any) =>
        api.post(`/api/organizations/${organizationId}/workspaces`, data),

    getOrganizationWorkspaces: (organizationId: string) =>
        api.get(`/api/organizations/${organizationId}/workspaces`),

    // Workspaces (legacy)
    getMyWorkspace: () => api.get("/api/my-workspace"),

    getWorkspaces: () => api.get("/api/workspaces"),

    getWorkspace: (id: string) => api.get(`/api/workspace/${id}`),

    deleteWorkspace: (id: string) => api.delete(`/api/workspace/${id}`),

    // Documents
    uploadDocuments: (formData: FormData) =>
        api.post("/api/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),

    classifyDocuments: (data: any) => api.post("/api/classify", data),

    // Analysis
    runAnalysis: (data: any) => api.post("/api/analyze", data),

    orchestrate: (data: any) => api.post("/api/orchestrate", data),

    generateReport: (data: any) => api.post("/api/report", data),

    getEarlyWarning: (data: any) => api.post("/api/early-warning", data),
};

export default api;
