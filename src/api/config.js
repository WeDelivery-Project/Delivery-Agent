import axios from 'axios';

export const Request = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    Accept: 'application/json',
    'api-key': 'zbkq21R31',
  },
});

Request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  config.headers.Authorization = token;
  return config;
});
