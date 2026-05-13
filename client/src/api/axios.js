import axios from 'axios';

const api = axios.create({

  // ✅ AWS API Gateway URL
  baseURL: process.env.REACT_APP_API_URL,

  headers: {
    'Content-Type': 'application/json',
  },

  withCredentials: false,
});


// ✅ Attach JWT token automatically
api.interceptors.request.use(

  (config) => {

    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);


// ✅ Handle responses/errors
api.interceptors.response.use(

  (response) => response,

  (error) => {

    // Auto logout if token expired
    if (error.response?.status === 401) {

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;