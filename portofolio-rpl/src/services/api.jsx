// services/api.jsx
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// ── Token & Auth Helpers ────────────────────────────────────────────────────
export const getToken = () => localStorage.getItem('token');
export const getUser  = () => {
  try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
};
export const saveAuth = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// ── Axios Instance Configuration ───────────────────────────────────────────
const api = axios.create({ baseURL: BASE_URL });

// Interceptor to automatically attach the Bearer token if it exists
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle global 401 response (Unauthorized)
api.interceptors.response.use(
  (response) => response.data, // Flatten response data across all axios requests
  (error) => {
    if (error.response?.status === 401) {
      clearAuth();
      // Only redirect if the user is attempting to view protected admin panels
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error.response?.data || { message: error.message });
  }
);

// ── Auth APIs ───────────────────────────────────────────────────────────────
export const login = async (email, password) => {
  const payload = typeof email === 'object' ? email : { email, password };
  try {
    const data = await api.post('/auth/login', payload);
    if (data.token) saveAuth(data.token, data.user);
    return { success: true, ...data };
  } catch (error) {
    return { success: false, message: error.message || 'Login gagal' };
  }
};

export const register = async (nama, email, password) => {
  const payload = typeof nama === 'object' ? nama : { nama, email, password };
  try {
    return await api.post('/auth/register', payload);
  } catch (error) {
    return { success: false, message: error.message || 'Registrasi gagal' };
  }
};

export const getMe = async () => {
  try {
    return await api.get('/auth/me');
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// ── Contact Email API ───────────────────────────────────────────────────────
export const sendContactEmail = async (data) => {
  try {
    return await api.post('/contact/send', {
      nama: data.nama,
      email: data.email,
      subject: data.subject || 'Pesan dari Portfolio Website',
      message: data.pesan || data.message
    });
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// ── Public APIs (Removes '/public' to resolve 401 routing blockages) ────────
export const getPublicProjects = async () => {
  try {
    const data = await api.get('/projects');
    return data;
  } catch (error) {
    console.warn('Menggunakan fallback mock data untuk projects.');
    return { 
      success: true, 
      projects: [
        { id: 1, title: 'Portfolio Pribadi', description: 'Website portofolio dengan React + Vite', technologies: 'React, Vite, CSS', github_url: 'https://github.com' },
        { id: 2, title: 'Sistem Absensi Digital', description: 'Aplikasi absensi online berbasis web untuk sekolah', technologies: 'Laravel, MySQL, Bootstrap 5', github_url: '' },
        { id: 3, title: 'Aplikasi Kasir Sederhana', description: 'Sistem point-of-sale untuk toko kecil', technologies: 'React, Express.js, MySQL', github_url: '' }
      ]
    };
  }
};

export const getPublicSkills = async () => {
  try {
    const data = await api.get('/skills');
    return data;
  } catch (error) {
    console.warn('Menggunakan fallback mock data untuk skills.');
    return { 
      success: true, 
      skills: [
        { id: 1, name: 'React.js', icon: '⚛️', order: 1 },
        { id: 2, name: 'Express.js', icon: '🚀', order: 2 },
        { id: 3, name: 'MySQL', icon: '🐬', order: 3 }
      ]
    };
  }
};

// ── Protected Dashboard / Admin CRUD APIs ───────────────────────────────────
export const getAllProjects = async () => {
  try { return await api.get('/projects'); } catch { return { success: false, projects: [] }; }
};

export const getProjectById = async (id) => {
  try { return await api.get(`/projects/${id}`); } catch (error) { return { success: false, message: error.message }; }
};

export const createProject = async (data) => {
  try { return await api.post('/projects', data); } catch (error) { return { success: false, message: error.message }; }
};

export const updateProject = async (id, data) => {
  try { return await api.put(`/projects/${id}`, data); } catch (error) { return { success: false, message: error.message }; }
};

export const deleteProject = async (id) => {
  try { return await api.delete(`/projects/${id}`); } catch (error) { return { success: false, message: error.message }; }
};

export const getAllSkills = async () => {
  try { return await api.get('/skills'); } catch { return { success: false, skills: [] }; }
};

export const createSkill = async (data) => {
  try { return await api.post('/skills', data); } catch (error) { return { success: false, message: error.message }; }
};

export const updateSkill = async (id, data) => {
  try { return await api.put(`/skills/${id}`, data); } catch (error) { return { success: false, message: error.message }; }
};

export const deleteSkill = async (id) => {
  try { return await api.delete(`/skills/${id}`); } catch (error) { return { success: false, message: error.message }; }
};

// ── Dashboard Statistics APIs ───────────────────────────────────────────────
export const getDashboardStats = async () => {
  try {
    return await api.get('/dashboard/stats');
  } catch {
    return { success: true, data: { projects: 0, skills: 0, users: 1 } };
  }
};

export const getAdminDashboard = async () => {
  try { return await api.get('/dashboard/admin'); } catch (error) { return { success: false, message: error.message }; }
};

// ── ✨ ABOUT ME MANAGEMENT (UPDATED TO USE INTERCEPTOR INSTANCE) ──
export const getAbout = async () => {
  try {
    // Memanfaatkan middleware instance 'api' bawaan file (Otomatis lari ke /api/about)
    return await api.get('/about');
  } catch (error) {
    return { success: false, message: error.message || 'Gagal memuat data About' };
  }
};

export const updateAbout = async (aboutData) => {
  try {
    // Token Authorization otomatis disisipkan oleh interceptor di atas! Jadi tidak perlu manual lagi.
    return await api.put('/about', aboutData);
  } catch (error) {
    return { success: false, message: error.message || 'Gagal memperbarui data About' };
  }
};

// ── Legacy Support Object Aliases (Keeps old layout files happy) ─────────────
export const authAPI = { login, me: getMe, logout: clearAuth };
export const projectAPI = { getAll: getAllProjects, getOne: getProjectById, create: createProject, update: updateProject, delete: deleteProject };
export const skillAPI = { getAll: getAllSkills, create: createSkill, update: updateSkill, delete: deleteSkill };

export default api;