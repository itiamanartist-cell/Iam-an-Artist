import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

const instance = axios.create({
  baseURL: 'https://iam-an-artist.onrender.com/api', // Pointing to live backend
});

instance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// We could add connection interceptors here to handle 401s uniquely
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
       // Optional: clear auth store if token is rejected/expired
       useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default instance;
