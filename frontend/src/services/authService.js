import api from "./api";

export const login = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  localStorage.setItem("token", res.data.token);
  console.log(res)
  return res.data;
};

export const register = async (firstName, lastName, email, password) => {
  const res = await api.post("/auth/register", { firstName, lastName, email, password });
  localStorage.setItem("token", res.data.token);
  return res.data;
};
