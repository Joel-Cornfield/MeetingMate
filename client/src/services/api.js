import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:4000/api",
    withCredentials: true, // Forces the browser to send HttpOnly cookies with every request
});

// Response interceptor to catch expired tokens
api.interceptors.request.use((config) => {
    return config;
}, (error) => {
    if (error.response && error.response.status === 401) {
        console.warn(`Token expired or unauthorized. Logging out...`);

        // To Do: Clear any local user state/context 

        window.location.href = "/login";
    }
    return Promise.reject(error);
});

export default api;
