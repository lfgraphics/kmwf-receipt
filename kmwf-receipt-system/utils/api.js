import axios from 'axios';

const API = axios.create({
  baseURL: 'http://192.168.12.228:5000', // Replace with backend URL
});

export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
