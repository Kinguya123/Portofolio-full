import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';

export default function Contact() {
  const formRef = useRef();
  const [form, setForm] = useState({ nama: "", pesan: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (!form.nama || !form.pesan) {
      setError('Harap isi nama dan pesan!');
      setLoading(false);
      return;
    }

    try {
      const templateParams = {
        from_name: form.nama,
        message: form.pesan,
      };

      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      if (result.status === 200) {
        setSuccess(true);
        setForm({ nama: "", pesan: "" });
        if (formRef.current) formRef.current.reset();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError('Gagal mengirim pesan');
      }
    } catch (err) {
      setError('Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section">
      <h2>Kontak</h2>
      
      {success && (
        <div className="alert-success">
          ✅ Pesan berhasil dikirim!
        </div>
      )}
      
      {error && (
        <div className="alert-error">
          ❌ {error}
        </div>
      )}
      
      <form ref={formRef} className="form" onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Nama" 
          value={form.nama} 
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
          disabled={loading}
        />
        <textarea 
          placeholder="Pesan" 
          rows="5"
          value={form.pesan} 
          onChange={(e) => setForm({ ...form, pesan: e.target.value })}
          disabled={loading}
        ></textarea>
        <button type="submit" disabled={loading}>
          {loading ? 'Mengirim...' : 'Kirim'}
        </button>
      </form>
    </section>
  );
}