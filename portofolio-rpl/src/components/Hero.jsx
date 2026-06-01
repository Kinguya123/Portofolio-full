import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="hero">
      <p className="hero-tagline">Fikry Azzam Z.A.Y</p>
      <h1>Selamat Datang di Portofolio Saya</h1>
      <p className="hero-subtitle">Siswa Kelas XI Rekayasa Perangkat Lunak</p>
      <div className="hero-buttons">
        <Link to="/projects" className="btn btn-primary">
          📁 Lihat Proyek
        </Link>
        <a href="#skill" className="btn btn-secondary">
          ⚡lihat skill
        </a>
      </div>
    </section>
  );
};

export default Hero;