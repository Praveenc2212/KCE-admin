import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:1812/api',
  withCredentials: true, // required to send and receive cookies across origins
});

export default axiosInstance;
