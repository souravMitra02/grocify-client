export const authHelper = {
  getAuthHeaders: (): HeadersInit => {
    return {
      "Content-Type": "application/json",
    };
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