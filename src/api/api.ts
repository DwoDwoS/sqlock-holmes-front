import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:8080'; // Adjust to your Spring Boot server URL
axios.defaults.headers.post['Content-Type'] = 'application/json';

// You can add interceptors here for handling tokens, errors, etc.
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axios;