import api from "./api";

export const login = async (username, password) => {
  const res = await api.post("/auth/login", { username, password });
  localStorage.setItem("token", res.data.token);
  return res.data;
};

export const register = async (firstName, lastName, username, password) => {
  const res = await api.post("/auth/register", { firstName, lastName, username, password });
  localStorage.setItem("token", res.data.token);
  return res.data;
};
