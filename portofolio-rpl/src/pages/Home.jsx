import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import SkillCard from '../components/SkillCard';
import { getAllSkills }from '../services/api';

export default function Home() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fungsi ini dijalankan sekali saat komponen pertama kali dimuat
    const fetchSkills = async () => {
      try {
        const result = await getAllSkills();
        if (result.success) setSkills(result.data);
      } catch (err) {
        console.error('Gagal mengambil data skills:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  return (
    <>
      <Hero />
      <section id='skill' className='section'>
        <h2>Keahlian Saya</h2>
        {loading ? (
          <p>Memuat data...</p>
        ) : (
          <div className='grid'>
            {skills.map(skill => (
              <SkillCard
                key={skill.id}
                title={skill.nama}
                desc={skill.deskripsi}
                icon={skill.icon}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}