// src/utils/tokenStorage.js
export const tokenStorage = {
  save: (token) => {
    localStorage.setItem("auth_token", token);
  },
  get: () => localStorage.getItem("auth_token"),
  clear: () => {
    localStorage.removeItem("auth_token");
  },
};