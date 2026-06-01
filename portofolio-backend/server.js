'use strict';

// Load environment variables
require('dotenv').config();

// Import library
const express = require('express');
const cors = require('cors');
const session = require('express-session');

// Import routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const skillRoutes = require('./routes/skillRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const aboutRoutes = require('./routes/aboutRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // URL frontend React
  credentials: true // Izinkan kirim cookie/session
}));

// ✨ FIX: Menambah limit muatan payload JSON dan URL-encoded hingga 50 Megabytes 
// Langkah ini mencegah Express mengalami crash (Error 500) saat menerima string Base64 gambar
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set true jika pakai HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 jam
  }
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/about', aboutRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Portfolio API is running',
    session: req.session.user ? 'Logged in' : 'Not logged in',
    endpoints: {
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        logout: 'POST /api/auth/logout',
        me: 'GET /api/auth/me'
      },
      projects: {
        all: 'GET /api/projects',
        detail: 'GET /api/projects/:id',
        create: 'POST /api/projects (Admin)',
        update: 'PUT /api/projects/:id (Admin)',
        delete: 'DELETE /api/projects/:id (Admin)'
      },
      skills: {
        all: 'GET /api/skills',
        detail: 'GET /api/skills/:id',
        create: 'POST /api/skills (Admin)',
        update: 'PUT /api/skills/:id (Admin)',
        delete: 'DELETE /api/skills/:id (Admin)'
      },
      dashboard: {
        main: 'GET /api/dashboard',
        summary: 'GET /api/dashboard/summary',
        charts: 'GET /api/dashboard/charts'
      },
      about: {
        get: 'GET /api/about',
        update: 'PUT /api/about'
      }
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.url} tidak ditemukan`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan pada server',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
  🚀 Server berjalan di http://localhost:${PORT}
  📁 Environment: ${process.env.NODE_ENV || 'development'}
  
  🔗 Endpoints:
  ┌─────────────────────────────────────────────────────┐
  │ AUTH                                                │
  ├─────────────────────────────────────────────────────┤
  │ POST   /api/auth/login      - Login user            │
  │ POST   /api/auth/register   - Register user         │
  │ POST   /api/auth/logout     - Logout                │
  │ GET    /api/auth/me         - Get current user      │
  ├─────────────────────────────────────────────────────┤
  │ PROJECTS (CRUD)                                     │
  ├─────────────────────────────────────────────────────┤
  │ GET    /api/projects        - All projects          │
  │ GET    /api/projects/:id    - One project           │
  │ POST   /api/projects        - Create (Admin)        │
  │ PUT    /api/projects/:id    - Update (Admin)        │
  │ DELETE /api/projects/:id    - Delete (Admin)        │
  ├─────────────────────────────────────────────────────┤
  │ SKILLS (CRUD)                                       │
  ├─────────────────────────────────────────────────────┤
  │ GET    /api/skills          - All skills            │
  │ GET    /api/skills/:id      - One skill             │
  │ POST   /api/skills          - Create (Admin)        │
  │ PUT    /api/skills/:id      - Update (Admin)        │
  │ DELETE /api/skills/:id      - Delete (Admin)        │
  ├─────────────────────────────────────────────────────┤
  │ DASHBOARD                                           │
  ├─────────────────────────────────────────────────────┤
  │ GET    /api/dashboard       - Main dashboard        │
  │ GET    /api/dashboard/summary - Stats summary     │
  │ GET    /api/dashboard/charts - Chart data            │
  │ ABOUT                                               │
  ├─────────────────────────────────────────────────────┤
  │ GET    /api/about            - Get about data        │
  │ PUT    /api/about            - Update about data     │
  └─────────────────────────────────────────────────────┘
  `);
});