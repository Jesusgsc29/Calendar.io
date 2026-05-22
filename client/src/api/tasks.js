import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  withCredentials: true,
});

export const fetchMe = () => api.get('/me').then(r => r.data);
export const fetchTasks = () => api.get('/tasks').then(r => r.data);
export const createTask = (data) => api.post('/tasks', data).then(r => r.data);
export const updateTask = (id, data) => api.patch(`/tasks/${id}`, data).then(r => r.data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`).then(r => r.data);

export const loginWithGoogle = () => {
  window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/auth/google`;
};

export const logout = () => api.post('/auth/logout').then(r => r.data);