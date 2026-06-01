import { useState, useEffect } from 'react';
import { getAbout } from '../services/api';

export default function About() {
  // Menggunakan data asli kamu sebagai default state awal sebelum API selesai dimuat
  const [about, setAbout] = useState({
    bio: 'Saya adalah siswa kelas XI Rekayasa Perangkat Lunak yang memiliki minat di bidang pemrograman web dan pengembangan aplikasi.',
    nama: 'Fikry Azzam Zalfa Ash Shiddieq Yassin',
    kelas: 'XI RPL A',
    sekolah: 'SMK PK Pusdikhubad'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const result = await getAbout();
        if (result.success && result.data) {
          setAbout(result.data);
        }
      } catch (error) {
        console.error('Gagal mengambil data tentang saya:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  return (
    <section className="section">
      <h2>Tentang Saya</h2>
      {loading ? (
        <p>Memuat data profil...</p>
      ) : (
        <>
          <p>{about.bio}</p>
          <p>Nama: {about.nama}</p>
          <p>Kelas: {about.kelas}</p>
          <p>Sekolah: {about.sekolah}</p>
        </>
      )}
    </section>
  );
}