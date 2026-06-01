import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getAllProjects, 
  getAllSkills,
  createProject,
  updateProject,
  deleteProject,
  createSkill,
  updateSkill,
  deleteSkill,
  getAbout,       
  updateAbout     
} from '../services/api';

// Chart.js untuk grafik
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from 'chart.js';
import { Line, Doughnut, Pie } from 'react-chartjs-2'; // ✨ Ditambahkan Pie Chart

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

const initialFormState = {
  judul: '',
  deskripsi: '',
  teknologi: '',
  url_github: '',
  gambar: '',
  nama: '',
  icon: '💻',
  deskripsi_skill: ''
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [activeChart, setActiveChart] = useState('daily');
  const [realtimeVisitors, setRealtimeVisitors] = useState(24);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  
  // State untuk manajemen gambar & pratinjau
  const [uploadMethod, setUploadMethod] = useState('url'); 
  const [previewUrl, setPreviewUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  // State untuk Manajemen Profil Tentang Saya
  const [aboutData, setAboutData] = useState({ nama: '', kelas: '', sekolah: '', bio: '' });
  const [aboutSaving, setAboutSaving] = useState(false);

  const BACKEND_URL = "http://localhost:3000";

  // Mock data for charts
  const [visitorData, setVisitorData] = useState({
    daily: { labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'], values: [45, 52, 38, 65, 78, 89, 94] },
    weekly: { labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4', 'Minggu 5', 'Minggu 6', 'Minggu 7'], values: [320, 450, 380, 520, 610, 580, 720] },
    monthly: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'], values: [1250, 1480, 1620, 1890, 2100, 2450, 2780, 3020, 3350, 3680, 3920, 4250] }
  });

  const [topPages] = useState([
    { page: '/', name: 'Beranda', views: 1250, percentage: 45 },
    { page: '/projects', name: 'Proyek', views: 890, percentage: 32 },
    { page: '/about', name: 'Tentang', views: 450, percentage: 16 },
    { page: '/contact', name: 'Kontak', views: 190, percentage: 7 }
  ]);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('project');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ ...initialFormState });

  const [userName, setUserName] = useState('Admin');
  const [userEmail, setUserEmail] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const projectsResult = await getAllProjects();
      if (projectsResult.success && projectsResult.data && projectsResult.data.length > 0) {
        setProjects(projectsResult.data);
      } else {
        setProjects([
          { id: 1, judul: 'Portfolio Pribadi', deskripsi: 'Website portofolio dengan React + Vite', teknologi: 'React, Vite, CSS', url_github: 'https://github.com/example/portfolio', gambar: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8' },
          { id: 2, judul: 'Sistem Absensi Digital', deskripsi: 'Aplikasi absensi online berbasis web untuk sekolah', teknologi: 'Laravel, MySQL, Bootstrap 5', url_github: 'https://github.com/example/absensi', gambar: '' },
          { id: 3, judul: 'Aplikasi Kasir Sederhana', deskripsi: 'Sistem point-of-sale untuk toko kecil', teknologi: 'React, Express.js, MySQL', url_github: 'https://github.com/example/kasir', gambar: '' }
        ]);
      }
      
      const skillsResult = await getAllSkills();
      if (skillsResult.success && skillsResult.data && skillsResult.data.length > 0) {
        setSkills(skillsResult.data);
      } else {
        setSkills([
          { id: 1, nama: 'React.js', deskripsi: 'Frontend development dengan React Hooks', icon: '⚛️' },
          { id: 2, nama: 'Laravel', deskripsi: 'Backend development dengan Laravel', icon: '🐘' },
          { id: 3, nama: 'UI/UX Design', deskripsi: 'Desain antarmuka pengguna', icon: '🎨' }
        ]);
      }

      const aboutResult = await getAbout();
      if (aboutResult.success) {
        setAboutData(aboutResult.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showNotification('Gagal memuat data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchRealtimeVisitors = useCallback(() => {
    const randomVisitors = Math.floor(Math.random() * 50) + 15;
    setRealtimeVisitors(randomVisitors);
  }, []);

  const fetchAllData = useCallback(() => {
    setLastUpdated(new Date());
    fetchRealtimeVisitors();
    setVisitorData(prev => {
      const newDailyValues = [...prev.daily.values];
      const lastValue = newDailyValues[newDailyValues.length - 1];
      const increment = Math.floor(Math.random() * 15) - 5;
      newDailyValues[newDailyValues.length - 1] = Math.max(0, lastValue + increment);
      return { ...prev, daily: { ...prev.daily, values: newDailyValues } };
    });
  }, [fetchRealtimeVisitors]);

  useEffect(() => {
    let interval;
    if (isAutoRefresh) {
      interval = setInterval(fetchAllData, 30000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isAutoRefresh, fetchAllData]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.email === 'user@gmail.com') {
      navigate('/');
      return;
    }
    
    setUserName(user.nama || user.email?.split('@')[0] || 'Admin');
    setUserEmail(user.email || 'admin@example.com');
    
    fetchDashboardData();
    fetchAllData();
  }, [navigate, fetchAllData]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  const handlePeriodChange = (period) => {
    setActiveChart(period);
    setLastUpdated(new Date());
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, gambar: url }));
    setPreviewUrl(url); 
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  // ========== PROJECT CRUD ==========
  const openAddProjectModal = () => {
    setEditingItem(null);
    setFormData({ ...initialFormState });
    setUploadMethod('url');
    setPreviewUrl('');
    setSelectedFile(null);
    setModalType('project');
    setModalOpen(true);
  };

  const openEditProjectModal = (project) => {
    setEditingItem(project);
    setFormData({
      ...initialFormState,
      judul: project.judul || '',
      deskripsi: project.deskripsi || '',
      teknologi: project.teknologi || '',
      url_github: project.url_github || '',
      gambar: project.gambar || ''
    });

    if (project.gambar && (project.gambar.startsWith('http://') || project.gambar.startsWith('https://'))) {
      setUploadMethod('url');
      setPreviewUrl(project.gambar);
    } else if (project.gambar && project.gambar.startsWith('data:')) {
      setUploadMethod('file');
      setPreviewUrl(project.gambar);
    } else if (project.gambar) {
      setUploadMethod('file');
      setPreviewUrl(`${BACKEND_URL}${project.gambar}`);
    } else {
      setUploadMethod('url');
      setPreviewUrl('');
    }

    setSelectedFile(null);
    setModalType('project');
    setModalOpen(true);
  };

  const handleSaveProject = async () => {
    if (!formData.judul || !formData.deskripsi) {
      showNotification('Judul dan deskripsi harus diisi!', 'error');
      return;
    }

    try {
      let result;
      let dataToSend;

      const config = {
        headers: {
          'Content-Type': uploadMethod === 'file' ? 'multipart/form-data' : 'application/json'
        }
      };

      if (uploadMethod === 'file' && selectedFile) {
        const data = new FormData();
        data.append('judul', formData.judul);
        data.append('deskripsi', formData.deskripsi);
        data.append('teknologi', formData.teknologi);
        data.append('url_github', formData.url_github);
        data.append('image', selectedFile); 
        dataToSend = data;
      } else {
        dataToSend = {
          judul: formData.judul,
          deskripsi: formData.deskripsi,
          teknologi: formData.teknologi,
          url_github: formData.url_github,
          gambar: formData.gambar
        };
      }

      if (editingItem) {
        result = await updateProject(editingItem.id, dataToSend, config);
        if (result.success) {
          showNotification(`✅ Proyek "${formData.judul}" berhasil diupdate!`);
          await fetchDashboardData();
          setModalOpen(false);
        } else {
          showNotification(result.message || 'Gagal mengupdate proyek', 'error');
        }
      } else {
        result = await createProject(dataToSend, config);
        if (result.success) {
          showNotification(`✅ Proyek "${formData.judul}" berhasil ditambahkan!`);
          await fetchDashboardData();
          setModalOpen(false);
        } else {
          showNotification(result.message || 'Gagal menambahkan proyek', 'error');
        }
      }
    } catch (error) {
      console.error('Error saving project:', error);
      showNotification('Terjadi kesalahan saat menyimpan', 'error');
    }
  };

  const handleDeleteProject = async (id, judul) => {
    if (window.confirm(`⚠️ Yakin ingin menghapus proyek "${judul}"?\n\nData yang dihapus tidak dapat dikembalikan!`)) {
      setDeletingId(id);
      try {
        const result = await deleteProject(id);
        if (result.success) {
          showNotification(`🗑️ Proyek "${judul}" berhasil dihapus!`);
          await fetchDashboardData();
        } else {
          showNotification(result.message || 'Gagal menghapus proyek', 'error');
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        showNotification('Terjadi kesalahan saat menghapus', 'error');
      } finally {
        setDeletingId(null);
      }
    }
  };

  // ========== SKILL CRUD ==========
  const openAddSkillModal = () => {
    setEditingItem(null);
    setFormData({ ...initialFormState, icon: '💻' });
    setModalType('skill');
    setModalOpen(true);
  };

  const openEditSkillModal = (skill) => {
    setEditingItem(skill);
    setFormData({
      ...initialFormState,
      nama: skill.nama || '',
      deskripsi_skill: skill.deskripsi || '',
      icon: skill.icon || '📚'
    });
    setModalType('skill');
    setModalOpen(true);
  };

  const handleSaveSkill = async () => {
    if (!formData.nama) {
      showNotification('Nama skill harus diisi!', 'error');
      return;
    }

    try {
      let result;
      const skillData = { nama: formData.nama, deskripsi: formData.deskripsi_skill, icon: formData.icon };
      
      if (editingItem) {
        result = await updateSkill(editingItem.id, skillData);
        if (result.success) {
          showNotification(`✅ Skill "${formData.nama}" berhasil diupdate!`);
          await fetchDashboardData();
          setModalOpen(false);
        } else {
          showNotification(result.message || 'Gagal mengupdate skill', 'error');
        }
      } else {
        result = await createSkill(skillData);
        if (result.success) {
          showNotification(`✅ Skill "${formData.nama}" berhasil ditambahkan!`);
          await fetchDashboardData();
          setModalOpen(false);
        } else {
          showNotification(result.message || 'Gagal menambahkan skill', 'error');
        }
      }
    } catch (error) {
      console.error('Error saving skill:', error);
      showNotification('Terjadi kesalahan saat menyimpan', 'error');
    }
  };

  const handleDeleteSkill = async (id, nama) => {
    if (window.confirm(`⚠️ Yakin ingin menghapus skill "${nama}"?\n\nData yang dihapus tidak dapat dikembalikan!`)) {
      setDeletingId(id);
      try {
        const result = await deleteSkill(id);
        if (result.success) {
          showNotification(`🗑️ Skill "${nama}" berhasil dihapus!`);
          await fetchDashboardData();
        } else {
          showNotification(result.message || 'Gagal menghapus skill', 'error');
        }
      } catch (error) {
        console.error('Error deleting skill:', error);
        showNotification('Terjadi kesalahan saat menghapus', 'error');
      } finally {
        setDeletingId(null);
      }
    }
  };

  // ========== ABOUT SAVE ACTION ==========
  const handleSaveAbout = async () => {
    setAboutSaving(true);
    try {
      const result = await updateAbout(aboutData);
      if (result.success) {
        showNotification('✅ Data Tentang Saya berhasil diperbarui!');
        await fetchDashboardData();
      } else {
        showNotification(result.message || 'Gagal memperbarui profil', 'error');
      }
    } catch (error) {
      showNotification('Terjadi kesalahan sistem', 'error');
    } finally {
      setAboutSaving(false);
    }
  };

  const currentChartData = {
    labels: visitorData[activeChart].labels,
    datasets: [{
      label: `Pengunjung ${activeChart === 'daily' ? 'Harian' : activeChart === 'weekly' ? 'Mingguan' : 'Bulanan'}`,
      data: visitorData[activeChart].values,
      borderColor: activeChart === 'daily' ? 'rgb(59, 130, 246)' : activeChart === 'weekly' ? 'rgb(139, 92, 246)' : 'rgb(34, 197, 94)',
      backgroundColor: activeChart === 'daily' ? 'rgba(59, 130, 246, 0.1)' : activeChart === 'weekly' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(34, 197, 94, 0.1)',
      tension: 0.4,
      fill: true,
    }]
  };

  const doughnutData = {
    labels: topPages.map(p => p.name),
    datasets: [{
      data: topPages.map(p => p.views),
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
      borderWidth: 0,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { font: { size: 12 } } },
      tooltip: { backgroundColor: 'rgba(0,0,0,0.8)', callbacks: { label: (context) => `👥 ${context.raw} pengunjung` } }
    },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1, callback: (value) => value + ' org' } } }
  };

  const totalVisitors = visitorData[activeChart]?.values?.reduce((a, b) => a + b, 0) || 0;

  // ========== ✨ LOGIKA PENGHITUNG PERSENTASE TEKNOLOGI SECARA DINAMIS ==========
  const technologyPieData = useMemo(() => {
    const counts = {};
    
    // Looping seluruh data proyek yang ada di state
    projects.forEach(p => {
      if (p.teknologi) {
        // Pisahkan teks jika menggunakan koma, lalu hilangkan spasi kosong
        const techs = p.teknologi.split(',').map(t => t.trim());
        techs.forEach(t => {
          if (t) {
            // Hitung akumulasi kemunculannya
            counts[t] = (counts[t] || 0) + 1;
          }
        });
      }
    });

    const labels = Object.keys(counts);
    const values = Object.values(counts);

    // Palet warna estetik untuk tiap potongan diagram lingkaran
    const colorPalette = [
      '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', 
      '#ec4899', '#06b6d4', '#f43f5e', '#14b8a6', '#6366f1'
    ];
    const backgroundColors = labels.map((_, idx) => colorPalette[idx % colorPalette.length]);

    return {
      labels,
      datasets: [{
        data: values,
        backgroundColor: backgroundColors,
        borderWidth: 1,
      }]
    };
  }, [projects]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt', color: '#3b82f6' },
    { id: 'projects', label: 'Manajemen Proyek', icon: 'fas fa-folder-open', color: '#10b981' },
    { id: 'skills', label: 'Manajemen Keahlian', icon: 'fas fa-cogs', color: '#8b5cf6' },
    { id: 'about', label: 'Profile', icon: 'fas fa-user-edit', color: '#ef4444' }, 
    { id: 'visit', label: 'Lihat Portfolio', icon: 'fas fa-external-link-alt', color: '#f59e0b' }
  ];

  const renderContent = () => {
    switch(activeMenu) {
      case 'projects':
        return (
          <div className="admin-content-card">
            <div className="content-header">
              <h2><i className="fas fa-folder-open"></i> Manajemen Proyek</h2>
              <button onClick={openAddProjectModal} className="compose-btn">
                <i className="fas fa-plus-circle"></i> + Proyek Baru
              </button>
            </div>
            
            {projects.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-inbox"></i>
                <p>Belum ada proyek</p>
                <button onClick={openAddProjectModal} className="empty-action-btn">
                  <i className="fas fa-plus"></i> Buat Proyek Pertama
                </button>
              </div>
            ) : (
              <div className="projects-table-container">
                <table className="projects-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Foto</th>
                      <th>Judul Proyek</th>
                      <th>Deskripsi</th>
                      <th>Teknologi</th>
                      <th>GitHub</th>
                      <th style={{ textAlign: 'center' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project, index) => {
                      const imgSource = project.gambar 
                        ? (project.gambar.startsWith('http') || project.gambar.startsWith('data:') ? project.gambar : `${BACKEND_URL}${project.gambar}`)
                        : null;

                      return (
                        <tr key={project.id}>
                          <td>{index + 1}</td>
                          <td>
                            {imgSource ? (
                              <img 
                                src={imgSource} 
                                alt={project.judul || ''} 
                                style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} 
                              />
                            ) : (
                              <div style={{ width: '60px', height: '40px', backgroundColor: '#e5e7eb', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#9ca3af' }}>No Pic</div>
                            )}
                          </td>
                          <td><strong>{project.judul}</strong></td>
                          <td className="desc-cell">{project.deskripsi?.substring(0, 80)}...</td>
                          <td><span className="tech-badge">{project.teknologi || '-'}</span></td>
                          <td>
                            {project.url_github ? (
                              <a href={project.url_github} target="_blank" rel="noopener noreferrer" className="github-link">
                                <i className="fab fa-github"></i> Lihat
                              </a>
                            ) : '-'}
                          </td>
                          <td className="action-buttons">
                            <button onClick={() => openEditProjectModal(project)} className="btn-edit" title="Edit Proyek">
                              <i className="fas fa-edit"></i> Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteProject(project.id, project.judul)} 
                              className="btn-delete"
                              title="Hapus Proyek"
                              disabled={deletingId === project.id}
                            >
                              {deletingId === project.id ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-trash-alt"></i>} Hapus
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      
      case 'skills':
        return (
          <div className="admin-content-card">
            <div className="content-header">
              <h2><i className="fas fa-cogs"></i> Manajemen Keahlian</h2>
              <button onClick={openAddSkillModal} className="compose-btn">
                <i className="fas fa-plus-circle"></i> + Skill Baru
              </button>
            </div>
            
            {skills.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-star-of-life"></i>
                <p>Belum ada skill</p>
                <button onClick={openAddSkillModal} className="empty-action-btn">
                  <i className="fas fa-plus"></i> Tambah Skill
                </button>
              </div>
            ) : (
              <div className="skills-table-container">
                <table className="skills-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Icon</th>
                      <th>Nama Skill</th>
                      <th>Deskripsi</th>
                      <th style={{ textAlign: 'center' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skills.map((skill, index) => (
                      <tr key={skill.id}>
                        <td>{index + 1}</td>
                        <td style={{ fontSize: '28px' }}>{skill.icon || '📌'}</td>
                        <td><strong>{skill.nama}</strong></td>
                        <td>{skill.deskripsi || '-'}</td>
                        <td className="action-buttons">
                          <button onClick={() => openEditSkillModal(skill)} className="btn-edit" title="Edit Skill">
                            <i className="fas fa-edit"></i> Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteSkill(skill.id, skill.nama)} 
                            className="btn-delete"
                            title="Hapus Skill"
                            disabled={deletingId === skill.id}
                          >
                            {deletingId === skill.id ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-trash-alt"></i>} Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );

      case 'about': 
        return (
          <div className="admin-content-card">
            <div className="content-header">
              <h2><i className="fas fa-user-edit"></i> Profile Saya</h2>
            </div>
            <div className="form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px', maxWidth: '700px' }}>
              <div className="form-field" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontWeight: 'bold' }}>Nama Lengkap</label>
                <input 
                  type="text" 
                  value={aboutData.nama || ''} 
                  onChange={(e) => setAboutData(prev => ({ ...prev, nama: e.target.value }))}
                  placeholder="Masukkan nama lengkap..."
                />
              </div>
              <div className="form-field" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontWeight: 'bold' }}>Kelas</label>
                <input 
                  type="text" 
                  value={aboutData.kelas || ''} 
                  onChange={(e) => setAboutData(prev => ({ ...prev, kelas: e.target.value }))}
                  placeholder="Contoh: XI RPL A..."
                />
              </div>
              <div className="form-field" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontWeight: 'bold' }}>Asal Sekolah</label>
                <input 
                  type="text" 
                  value={aboutData.sekolah || ''} 
                  onChange={(e) => setAboutData(prev => ({ ...prev, sekolah: e.target.value }))}
                  placeholder="Masukkan nama sekolah..."
                />
              </div>
              <div className="form-field" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontWeight: 'bold' }}>Bio / Deskripsi Profil</label>
                <textarea 
                  rows="5" 
                  value={aboutData.bio || ''} 
                  onChange={(e) => setAboutData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Jelaskan deskripsi diri Anda..."
                />
              </div>
              <div style={{ marginTop: '10px' }}>
                <button 
                  type="button" 
                  className="btn-save" 
                  onClick={handleSaveAbout}
                  disabled={aboutSaving}
                  style={{ padding: '10px 25px' }}
                >
                  {aboutSaving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>} Perbarui Profil
                </button>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <>
            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card-modern">
                <div className="stat-icon-wrapper blue"><i className="fas fa-folder-open"></i></div>
                <div className="stat-info-modern">
                  <h3>{projects.length}</h3>
                  <p>Total Proyek</p>
                  <span className="stat-trend up"><i className="fas fa-arrow-up"></i> +12%</span>
                </div>
              </div>
              <div className="stat-card-modern">
                <div className="stat-icon-wrapper purple"><i className="fas fa-cogs"></i></div>
                <div className="stat-info-modern">
                  <h3>{skills.length}</h3>
                  <p>Keahlian</p>
                  <span className="stat-trend up"><i className="fas fa-arrow-up"></i> +5%</span>
                </div>
              </div>
              <div className="stat-card-modern">
                <div className="stat-icon-wrapper green"><i className="fas fa-users"></i></div>
                <div className="stat-info-modern">
                  <h3>1</h3>
                  <p>Pengguna Aktif</p>
                  <span className="stat-trend steady"><i className="fas fa-minus"></i> Stabil</span>
                </div>
              </div>
              <div className="stat-card-modern">
                <div className="stat-icon-wrapper orange"><i className="fas fa-chart-line"></i></div>
                <div className="stat-info-modern">
                  <h3>{totalVisitors.toLocaleString()}</h3>
                  <p>Total Kunjungan</p>
                  <span className="stat-trend up"><i className="fas fa-arrow-up"></i> +23%</span>
                </div>
              </div>
            </div>

            {/* Real-time Visitor Counter */}
            <div className="realtime-card">
              <div className="realtime-header">
                <h3><i className="fas fa-circle" style={{ color: '#10b981', fontSize: '12px' }}></i> Real-time Pengunjung</h3>
                <div className="realtime-controls">
                  <span className="last-updated"><i className="fas fa-clock"></i> Update: {lastUpdated.toLocaleTimeString()}</span>
                  <button 
                    className={`auto-refresh-btn ${isAutoRefresh ? 'active' : ''}`} 
                    onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                  >
                    <i className={`fas fa-${isAutoRefresh ? 'pause' : 'play'}`}></i>
                    {isAutoRefresh ? 'Auto Refresh ON' : 'Auto Refresh OFF'}
                  </button>
                  <button className="refresh-btn" onClick={fetchAllData}>
                    <i className="fas fa-sync-alt"></i> Refresh
                  </button>
                </div>
              </div>
              <div className="realtime-stats">
                <div className="online-users">
                  <div className="online-icon"><i className="fas fa-user-friends"></i></div>
                  <div className="online-count">
                    <span className="count">{realtimeVisitors}</span>
                    <span className="label">Online Sekarang</span>
                  </div>
                </div>
                <div className="total-today">
                  <div className="today-icon"><i className="fas fa-calendar-day"></i></div>
                  <div className="today-count">
                    <span className="count">{visitorData.daily.values[visitorData.daily.values.length - 1]}</span>
                    <span className="label">Hari Ini</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="chart-card">
              <div className="chart-header">
                <h3><i className="fas fa-chart-line"></i> Statistik Pengunjung</h3>
                <div className="chart-tabs">
                  <button className={`chart-tab ${activeChart === 'daily' ? 'active' : ''}`} onClick={() => handlePeriodChange('daily')}>
                    <i className="fas fa-calendar-day"></i> Harian
                  </button>
                  <button className={`chart-tab ${activeChart === 'weekly' ? 'active' : ''}`} onClick={() => handlePeriodChange('weekly')}>
                    <i className="fas fa-calendar-week"></i> Mingguan
                  </button>
                  <button className={`chart-tab ${activeChart === 'monthly' ? 'active' : ''}`} onClick={() => handlePeriodChange('monthly')}>
                    <i className="fas fa-calendar-alt"></i> Bulanan
                  </button>
                </div>
              </div>
              <div className="chart-container">
                <Line data={currentChartData} options={chartOptions} />
              </div>
            </div>

            {/* Top Pages & Activity */}
            <div className="two-columns">
              <div className="top-pages-card">
                <h3><i className="fas fa-chart-pie"></i> Halaman Terpopuler</h3>
                <div className="doughnut-container">
                  <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } } }} />
                </div>
                <div className="pages-list">
                  {topPages.map((page, idx) => (
                    <div key={idx} className="page-item">
                      <div className="page-name">
                        <i className="fas fa-file-alt"></i>
                        <span>{page.name}</span>
                      </div>
                      <div className="page-stats">
                        <span className="page-views">{page.views} views</span>
                        <div className="page-progress">
                          <div className="progress-bar" style={{ width: `${page.percentage}%` }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* ✨ KARTU BARU: PIE CHART PERSENTASE TEKNOLOGI PROYEK DINAMIS */}
              <div className="top-pages-card">
                <h3><i className="fas fa-chart-pie"></i> Persentase Teknologi Proyek</h3>
                <div className="doughnut-container" style={{ position: 'relative', height: '240px', marginTop: '10px' }}>
                  {projects.length === 0 || !technologyPieData.labels.length ? (
                    <p style={{ textAlign: 'center', color: '#888', paddingTop: '100px' }}>Belum ada data teknologi proyek</p>
                  ) : (
                    <Pie 
                      data={technologyPieData} 
                      options={{ 
                        responsive: true, 
                        maintainAspectRatio: false, 
                        plugins: { 
                          legend: { 
                            position: 'bottom', 
                            labels: { font: { size: 11 }, boxWidth: 12 } 
                          } 
                        } 
                      }} 
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Activity Info Row */}
            <div className="two-columns" style={{ marginTop: '20px' }}>
              <div className="info-card-modern" style={{ width: '100%' }}>
                <h3><i className="fas fa-info-circle"></i> Informasi Operasional</h3>
                <div className="activity-timeline">
                  <div className="activity-item">
                    <div className="activity-icon"><i className="fas fa-edit"></i></div>
                    <div className="activity-detail">
                      <strong>Edit Data</strong>
                      <p>Klik tombol <span className="highlight">Edit</span> untuk mengubah data proyek atau keahlian</p>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon"><i className="fas fa-plus-circle"></i></div>
                    <div className="activity-detail">
                      <strong>Tambah Data</strong>
                      <p>Klik tombol <span className="highlight">+ Proyek Baru / + Skill Baru</span> untuk memasukkan data baru</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"><i className="fas fa-spinner fa-spin"></i></div>
        <p>Memuat dashboard...</p>
      </div>
    );
  }

  return (
    <div className="gmail-dashboard">
      {/* Sidebar */}
      <aside className={`gmail-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <button className="menu-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            <i className="fas fa-bars"></i>
          </button>
          {!sidebarCollapsed && <h2><i className="fas fa-chalkboard-teacher"></i> Dashboard</h2>}
        </div>
        <button className="compose-btn-sidebar" onClick={() => setActiveMenu('dashboard')}>
          <i className="fas fa-chart-line"></i>
          {!sidebarCollapsed && <span>Overview</span>}
        </button>
        <nav className="sidebar-menu">
          {menuItems.map(item => (
            <button 
              key={item.id} 
              className={`menu-item ${activeMenu === item.id ? 'active' : ''}`} 
              onClick={() => item.id === 'visit' ? window.open('/', '_blank') : setActiveMenu(item.id)}
            >
              <i className={item.icon} style={{ color: item.color }}></i>
              {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-info-sidebar">
            <div className="user-avatar"><i className="fas fa-user-circle"></i></div>
            {!sidebarCollapsed && (
              <div className="user-details">
                <div className="user-name">{userName}</div>
                <div className="user-email">{userEmail}</div>
              </div>
            )}
          </div>
          <button className="logout-btn-gmail" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            {!sidebarCollapsed && <span>Keluar</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`gmail-main ${sidebarCollapsed ? 'expanded' : ''}`}>
        <div className="main-content-area">
          {renderContent()}
        </div>
      </main>

      {/* Notification Toast */}
      {notification.show && (
        <div className={`gmail-toast ${notification.type}`}>
          <i className={`fas fa-${notification.type === 'success' ? 'check-circle' : 'exclamation-triangle'}`}></i>
          <span>{notification.message}</span>
        </div>
      )}

      {/* Modal Form */}
      {modalOpen && (
        <div className="gmail-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="gmail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {editingItem 
                  ? `✏️ Edit ${modalType === 'project' ? 'Proyek' : 'Keahlian'}` 
                  : `➕ Tambah ${modalType === 'project' ? 'Proyek' : 'Keahlian'}`
                }
              </h3>
              <button className="close-modal-btn" onClick={() => setModalOpen(false)}>&times;</button>
            </div>
            
            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto', padding: '15px' }}>
              {modalType === 'project' ? (
                <div className="form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div className="form-field">
                    <label>Judul Proyek <span style={{ color: 'red' }}>*</span></label>
                    <input 
                      type="text" 
                      value={formData.judul || ''} 
                      onChange={(e) => setFormData(prev => ({ ...prev, judul: e.target.value }))} 
                      placeholder="Masukkan judul proyek..."
                    />
                  </div>
                  
                  <div className="form-field">
                    <label>Deskripsi Proyek <span style={{ color: 'red' }}>*</span></label>
                    <textarea 
                      rows="4" 
                      value={formData.deskripsi || ''} 
                      onChange={(e) => setFormData(prev => ({ ...prev, deskripsi: e.target.value }))} 
                      placeholder="Jelaskan detail proyek Anda..."
                    />
                  </div>
                  
                  <div className="form-field">
                    <label>Teknologi (Pisahkan dengan koma)</label>
                    <input 
                      type="text" 
                      value={formData.teknologi || ''} 
                      onChange={(e) => setFormData(prev => ({ ...prev, teknologi: e.target.value }))} 
                      placeholder="Contoh: React, Node.js, MySQL"
                    />
                  </div>
                  
                  <div className="form-field">
                    <label>Link GitHub / Source Code</label>
                    <input 
                      type="url" 
                      value={formData.url_github || ''} 
                      onChange={(e) => setFormData(prev => ({ ...prev, url_github: e.target.value }))} 
                      placeholder="https://github.com/username/repository"
                    />
                  </div>

                  <div className="form-field">
                    <label>Metode Input Gambar</label>
                    <div style={{ display: 'flex', gap: '15px', marginTop: '5px', marginBottom: '10px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontWeight: 'normal' }}>
                        <input 
                          type="radio" 
                          name="uploadMethod" 
                          checked={uploadMethod === 'url'} 
                          onChange={() => { 
                            setUploadMethod('url'); 
                            if (formData.gambar && (formData.gambar.startsWith('http://') || formData.gambar.startsWith('https://'))) {
                              setPreviewUrl(formData.gambar);
                            }
                          }} 
                        />
                        Gunakan URL Teks
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontWeight: 'normal' }}>
                        <input 
                          type="radio" 
                          name="uploadMethod" 
                          checked={uploadMethod === 'file'} 
                          onChange={() => { 
                            setUploadMethod('file'); 
                            if (selectedFile) {
                              setPreviewUrl(URL.createObjectURL(selectedFile));
                            } else if (editingItem && editingItem.gambar) {
                              setPreviewUrl(editingItem.gambar.startsWith('http') ? editingItem.gambar : `${BACKEND_URL}${editingItem.gambar}`);
                            }
                          }} 
                        />
                        Upload File Lokal
                      </label>
                    </div>

                    {uploadMethod === 'url' ? (
                      <input 
                        key="image-url-input"
                        type="url" 
                        value={formData.gambar || ''} 
                        onChange={handleImageUrlChange} 
                        placeholder="https://example.com/gambar.jpg"
                      />
                    ) : (
                      <input 
                        key="image-file-input"
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                      />
                    )}
                  </div>

                  {previewUrl && (
                    <div className="form-field" style={{ alignSelf: 'start', marginTop: '10px' }}>
                      <label>Pratinjau Gambar:</label>
                      <div style={{ position: 'relative', marginTop: '5px' }}>
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '6px', border: '1px dashed #ccc', padding: '4px' }} 
                        />
                        <button 
                          type="button" 
                          onClick={() => { 
                            setPreviewUrl(''); 
                            setSelectedFile(null); 
                            setFormData(prev => ({ ...prev, gambar: '' })); 
                          }}
                          style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#d93025', color: '#fff', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}
                          title="Hapus gambar"
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div className="form-field">
                    <label>Nama Keahlian <span style={{ color: 'red' }}>*</span></label>
                    <input 
                      type="text" 
                      value={formData.nama || ''} 
                      onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))} 
                      placeholder="Contoh: Java, UI/UX Design..."
                    />
                  </div>
                  <div className="form-field">
                    <label>Karakter Emojicon / Icon</label>
                    <input 
                      type="text" 
                      value={formData.icon || ''} 
                      onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))} 
                      placeholder="Contoh: ⚛️, 🎨, 💻"
                      style={{ width: '80px', textAlign: 'center', fontSize: '18px' }}
                    />
                  </div>
                  <div className="form-field">
                    <label>Deskripsi Keahlian</label>
                    <textarea 
                      rows="3" 
                      value={formData.deskripsi_skill || ''} 
                      onChange={(e) => setFormData(prev => ({ ...prev, deskripsi_skill: e.target.value }))} 
                      placeholder="Jelaskan kompetensi Anda tentang keahlian ini..."
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer" style={{ padding: '15px', borderTop: '1px solid #f1f3f4', display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '10px' }}>
              <button type="button" className="btn-cancel" onClick={() => setModalOpen(false)}>Batal</button>
              <button 
                type="button" 
                className="btn-save" 
                onClick={modalType === 'project' ? handleSaveProject : handleSaveSkill}
              >
                {editingItem ? 'Perbarui Data' : 'Simpan Proyek'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}