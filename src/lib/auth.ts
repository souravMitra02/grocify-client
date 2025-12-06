const TOKEN_KEY = "grocify_auth_token";

export const authHelper = {
  getAuthHeaders: (): HeadersInit => {
    const token = authHelper.getToken?.();
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  },

  setToken: (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  getToken: (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  },

  removeToken: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  setLoginState: (loggedIn: boolean) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("isLoggedIn", loggedIn ? "true" : "false");
    }
  },

  getLoginState: (): boolean => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("isLoggedIn") === "true";
    }
    return false;
  },

  clearLoginState: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isLoggedIn");
    }
  },
};
