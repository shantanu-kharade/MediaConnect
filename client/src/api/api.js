import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const getToken = () => localStorage.getItem('authToken');
export const setToken = (token) => localStorage.setItem('authToken', token);
export const removeToken = () => localStorage.removeItem('authToken');

api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        // Set Content-Type for JSON requests (not FormData)
        if (!(config.data instanceof FormData)) {
            config.headers['Content-Type'] = 'application/json';
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authApi = {
    signup: async (username, email, password) => {
        const res = await api.post('/auth/signup', {
            username,
            email,
            password,
        });
        return res.data;
    },

    login: async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        const data = res.data;
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
        const res = await api.get('/auth/profile');
        return res.data;
    },
};

export const usersApi = {
    getAllUsers: async () => {
        const res = await api.get('/users/');
        return res.data;
    },

    getUserById: async (userId) => {
        const res = await api.get(`/users/${userId}`);
        return res.data;
    },

    updateProfile: async (profileData) => {
        const res = await api.put('/users/profile/update', profileData);
        return res.data;
    },

    followUser: async (targetUserId) => {
        const res = await api.post(`/users/follow/${targetUserId}`);
        return res.data;
    },

    unfollowUser: async (targetUserId) => {
        const res = await api.post(`/users/unfollow/${targetUserId}`);
        return res.data;
    },

    getFollowers: async (userId) => {
        const res = await api.get(`/users/followers/${userId}`);
        return res.data;
    },

    getFollowings: async (userId) => {
        const res = await api.get(`/users/followings/${userId}`);
        return res.data;
    },

    changePassword: async (currentPassword, newPassword) => {   
        const res = await api.put('/users/change-password', { currentPassword, newPassword });
        return res.data;
    },

    getSuggestedUsers: async (limit = 3) => {
        const res = await api.get(`/users/suggested?limit=${limit}`);
        return res.data;
    },
};

export const postsApi = {
    createPost: async (imageFile, caption) => {
        console.log("API createPost - imageFile:", imageFile, "caption:", caption);
        const formData = new FormData();
        formData.append('media', imageFile); // Append the File object directly
        formData.append('caption', caption);
        
        console.log("FormData entries:", Array.from(formData.entries()));
        // Don't specify Content-Type header - let the browser set it with boundary
        const res = await api.post('/posts/create', formData);
        return res.data;
    },

    getAllPosts: async () => {
        const res = await api.get('/posts/all');
        return res.data;
    },

    getPostById: async (postId) => {
        const res = await api.get(`/posts/${postId}`);
        return res.data;
    },

    updatePost: async (postId, data) => {
        const res = await api.put(`/posts/update/${postId}`, data);
        return res.data;
    },

    deletePost: async (postId) => {
        const res = await api.delete(`/posts/delete/${postId}`);
        return res.data;
    },

    likePost: async (postId) => {
        const res = await api.post(`/posts/like/${postId}`);
        return res.data;
    },

    unlikePost: async (postId) => {
        const res = await api.post(`/posts/unlike/${postId}`);
        return res.data;
    },
};


export const commentsApi = {
    addComment: async (postId, content) => {
        const res = await api.post(`/comments/${postId}/add`, { content });
        return res.data;
    },

    getComments: async (postId) => {
        const res = await api.get(`/comments/${postId}`);
        return res.data;
    },

    updateComment: async (commentId, content) => {
        const res = await api.put(`/comments/${commentId}`, { content });
        return res.data;
    },

    deleteComment: async (commentId) => {
        const res = await api.delete(`/comments/${commentId}`);
        return res.data;
    },
};


export default api;