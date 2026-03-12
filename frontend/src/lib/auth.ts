import Cookies from "js-cookie";

const TOKEN_KEY = "creditai_token";
const USER_KEY = "creditai_user";

export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    avatar?: string;
    organizations: Array<{
        organizationId: string;
        role: "owner" | "admin" | "analyst" | "viewer";
        joinedAt: Date;
    }>;
    currentOrganizationId?: string;
}

export const authService = {
    // Store auth data
    setAuth(token: string, user: User) {
        Cookies.set(TOKEN_KEY, token, { expires: 1 / 3 }); // 8 hours
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    // Get token
    getToken(): string | undefined {
        return Cookies.get(TOKEN_KEY);
    },

    // Get user
    getUser(): User | null {
        const userStr = localStorage.getItem(USER_KEY);
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    },

    // Check if authenticated
    isAuthenticated(): boolean {
        return !!this.getToken();
    },

    // Logout
    logout() {
        Cookies.remove(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem("creditai_workspace");
        localStorage.removeItem("creditai_company");
    },

    // Get auth headers
    getAuthHeaders() {
        const token = this.getToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    },
};
