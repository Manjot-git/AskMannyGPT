const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:8080/api"
    : "https://your-backend-domain/api";

// 🧠 AUTH
export const signup = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  // Add success key
  return { success: res.ok, ...json };
};

export const login = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  // Add success key
  return { success: res.ok, ...json };
};

// 🧠 CHAT
export const getUserThreads = async (token) => {
  const res = await fetch(`${BASE_URL}/thread`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const sendMessage = async (data, token) => {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
