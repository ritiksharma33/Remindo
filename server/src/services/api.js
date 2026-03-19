const API_URL = "http://localhost:5000/api";

const getHeaders = () => ({
  "Content-Type": "application/json",
  "x-auth-token": localStorage.getItem("token") // or "Authorization": Bearer ... check your middleware
});

export const api = {
  // Get all dumps
  getEntries: () => fetch(`${API_URL}/entries`, { 
    headers: getHeaders() 
  }),
  
  // Create a new dump
  createEntry: (data) => fetch(`${API_URL}/entries`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data)
  })
};