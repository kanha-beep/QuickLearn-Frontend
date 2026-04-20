const TOKEN_KEY = "token";
const USER_KEY = "user";
const ROLE_KEY = "roles";

export const getStoredToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token || token === "undefined" || token === "null") {
    return "";
  }

  return token;
};

export const getStoredUser = () => {
  const rawUser = localStorage.getItem(USER_KEY);
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
};

export const getStoredRole = () => localStorage.getItem(ROLE_KEY) || "";

export const storeAuthSession = ({ token = "", user = null, roles = "" }) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }

  const resolvedRole = roles || user?.roles || "";
  if (resolvedRole) {
    localStorage.setItem(ROLE_KEY, resolvedRole);
  } else {
    localStorage.removeItem(ROLE_KEY);
  }
};

export const clearAuthSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem("tokens");
};
