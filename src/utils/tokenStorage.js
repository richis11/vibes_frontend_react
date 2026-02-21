export const tokenStorage = {
  save: (token, remember) => {
    if (remember) localStorage.setItem("auth_token", token);
    else sessionStorage.setItem("auth_token", token);
  },
  get: () =>
    localStorage.getItem("auth_token") ||
    sessionStorage.getItem("auth_token"),
  clear: () => {
    localStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_token");
  },
};