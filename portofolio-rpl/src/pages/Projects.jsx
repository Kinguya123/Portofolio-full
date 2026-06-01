import { useState, useEffect } from 'react';
import { getPublicProjects } from '../services/api';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const result = await getPublicProjects();
        if (result.success) {
          setProjects(result.data);
        } else {
          // Mock data jika API error
          setProjects([
            { id: 1, judul: 'Portfolio Pribadi', deskripsi: 'Website portofolio dengan React + Vite', teknologi: 'React, Vite, CSS', url_github: 'https://github.com/example/portfolio', gambar: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8' },
            { id: 2, judul: 'Sistem Absensi Digital', deskripsi: 'Aplikasi absensi online berbasis web untuk sekolah', teknologi: 'Laravel, MySQL, Bootstrap 5', url_github: 'https://github.com/example/absensi', gambar: '' },
            { id: 3, judul: 'Aplikasi Kasir Sederhana', deskripsi: 'Sistem point-of-sale untuk toko kecil', teknologi: 'React, Express.js, MySQL', url_github: 'https://github.com/example/kasir', gambar: '' }
          ]);
        }
      } catch (err) {
        console.error('Gagal mengambil data proyek:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <section className="section">
      <h2>Proyek Saya</h2>
      {loading ? (
        <p>Memuat data...</p>
      ) : (
        <div className="grid">
          {projects.map(p => {
            // ✨ FIX 1: Ubah port ke 3000 agar sinkron dengan backend server kamu
            const backendUrl = "http://localhost:3000"; 
            
            // ✨ FIX 2: Tambahkan kondisi p.gambar.startsWith('data:') agar string Base64 langsung dirender utuh
            const imgSource = p.gambar 
              ? (p.gambar.startsWith('http') || p.gambar.startsWith('data:') ? p.gambar : `${backendUrl}${p.gambar}`)
              : 'https://placehold.co/600x337?text=No+Image'; 

            return (
              <div key={p.id} className="card">
                {/* Wrapper Gambar */}
                <div 
                  className="card-image-wrapper" 
                  style={{ 
                    width: '100%', 
                    aspectRatio: '16 / 9', 
                    overflow: 'hidden', 
                    borderRadius: '6px', 
                    marginBottom: '15px',
                    backgroundColor: '#f0f0f0'
                  }}
                >
                  <img 
                    src={imgSource} 
                    alt={p.judul} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover', 
                      display: 'block' 
                    }} 
                  />
                </div>

                <h3>{p.judul}</h3>
                <p>{p.deskripsi}</p>
                <p><strong>Teknologi:</strong> {p.teknologi}</p>
                {p.url_github && (
                  <a href={p.url_github} target="_blank" rel="noreferrer" className="btn">GitHub</a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}