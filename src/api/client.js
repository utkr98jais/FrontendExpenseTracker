// Centralized Axios client with auth handling
import axios from "axios";

const client = axios.create({
    baseURL: "https://backendexpensetracker-ex5v.onrender.com",
    withCredentials: false,
});

// Attach Authorization header if a token exists
client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// On 401/403, clear session and redirect to login
let redirected = false;
const shouldBypassAuthRedirect = (url = "") => {
    // Don't loop on auth endpoints
    return (
        url.includes("/auth/login") ||
        url.includes("/auth/register") ||
        url.includes("/auth/logout")
    );
};

client.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const url = error?.config?.url || "";
        if ((status === 401 || status === 403) && !shouldBypassAuthRedirect(url)) {
            // Clear local storage
            localStorage.removeItem("token");
            localStorage.removeItem("username");

            // Avoid repeated redirects during burst of failing calls
            if (!redirected && typeof window !== "undefined") {
                redirected = true;
                // Use replace to avoid keeping a bad history entry
                if (window.location.pathname !== "/login") {
                    window.location.replace("/login");
                }
                // Reset the flag shortly after to permit future valid redirects
                setTimeout(() => {
                    redirected = false;
                }, 1000);
            }
        }
        return Promise.reject(error);
    }
);

export default client;
