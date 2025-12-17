import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getToken = () => localStorage.getItem('token');
export const setToken = (token) => localStorage.setItem('token', token);
export const removeToken = () => localStorage.removeItem('token');

api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authApi = {
    signup: async (username, email, password) => {
        return api.post('/auth/signup', {
            username,
            email,
            password,
        });
    },

    login: async (email, password) => {
        const data = await api.post('/auth/login', { email, password });
        if (data.token) {
            setToken(data.token);
        }
        return data;
    },

    logout: async () => {
        try {
            await api.post('/auth/logout');
        } finally {

            removeToken();
        }
    },

    getProfile: async () => {
        return api.get('/auth/profile');
    },
};

export const usersApi = {
    getAllUsers: async () => {
        return api.get('/users/');
    },

    getUserById: async (userId) => {
        return api.get(`/users/${userId}`);
    },

    updateProfile: async (profileData) => {
        return api.put('/users/profile/update', profileData);
    },

    followUser: async (targetUserId) => {
        return api.post(`/users/follow/${targetUserId}`);
    },

    unfollowUser: async (targetUserId) => {
        return api.post(`/users/unfollow/${targetUserId}`);
    },

    getFollowers: async (userId) => {
        return api.get(`/users/followers/${userId}`);
    },

    getFollowings: async (userId) => {
        return api.get(`/users/followings/${userId}`);
    },

    changePassword: async (currentPassword, newPassword) => {
        return api.put('/users/change-password', { currentPassword, newPassword });
    },
};


export default api;