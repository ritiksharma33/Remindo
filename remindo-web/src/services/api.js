const API_URL = "http://localhost:5000/api";

/**
 * Pure helper to generate headers. 
 * Expects 'token' to be the actual JWT string.
 */
const getHeaders = (token) => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${token}`,
});

export const api = {
  // ==============================
  // ENTRIES (Knowledge Garden)
  // ==============================

  getEntries: async (token) => {
    return fetch(`${API_URL}/entries`, { 
      headers: getHeaders(token) 
    });
  },

  createEntry: async (token, data) => {
    return fetch(`${API_URL}/entries`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
  },

  deleteEntry: async (token, id) => {
    return fetch(`${API_URL}/entries/${id}`, {
      method: "DELETE",
      headers: getHeaders(token),
    });
  },

  updateEntry: async (token, id, data) => {
    return fetch(`${API_URL}/entries/${id}`, {
      method: "PUT",
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
  },

  reviewEntry: async (token, id, rating) => {
    return fetch(`${API_URL}/entries/${id}/review`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify({ rating }),
    });
  },

  // ==============================
  // MISSIONS (Life Pulse)
  // ==============================

  getMissions: async (token) => fetch(`${API_URL}/missions`, { 
    headers: getHeaders(token) 
  }),
  createMission: async (token, data) => fetch(`${API_URL}/missions`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  }),
  deleteMission: async (token, id) => fetch(`${API_URL}/missions/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
  }),
};