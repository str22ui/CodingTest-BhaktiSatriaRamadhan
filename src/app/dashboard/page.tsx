'use client';

import { useEffect, useState } from 'react';
import { updateAdmin } from '@/lib/api';
import {
  validateEmail,
  validateName,
  validatePassword,
} from '@/lib/validation';
import { Admin } from '@/lib/types';
import DashboardLayout from '@/components/DashboardLayout';
import { Save, AlertCircle } from 'lucide-react';

export default function ProfilePage() {
  const [admin, setAdmin] = useState<Partial<Admin>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    namaDepan: '',
    namaBelakang: '',
    email: '',
    tanggalLahir: '',
    jenisKelamin: 'Laki-laki' as const,
    password: '',
  });

  useEffect(() => {
    const adminData = localStorage.getItem('admin');
    if (adminData) {
      const parsed = JSON.parse(adminData);
      setAdmin(parsed);
      setFormData({
        namaDepan: parsed.namaDepan || '',
        namaBelakang: parsed.namaBelakang || '',
        email: parsed.email || '',
        tanggalLahir: parsed.tanggalLahir || '',
        jenisKelamin: parsed.jenisKelamin || 'Laki-laki',
        password: '',
      });
    }
    setLoading(false);
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!validateName(formData.namaDepan))
      newErrors.namaDepan = 'Nama depan tidak valid';
    if (!validateName(formData.namaBelakang))
      newErrors.namaBelakang = 'Nama belakang tidak valid';
    if (!validateEmail(formData.email))
      newErrors.email = 'Email tidak valid';
    if (formData.password) {
      const passError = validatePassword(formData.password);
      if (passError) newErrors.password = passError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validateForm()) return;

    setSaving(true);
    try {
      const { password, ...rest } = formData;
        const updates = password ? { ...rest, password } : rest;


      await updateAdmin(admin.id as string, updates);

      const { password: _ignored, ...cleanAdmin } = { ...admin, ...updates };
        localStorage.setItem('admin', JSON.stringify(cleanAdmin));

      setSuccessMessage('Profile berhasil diperbarui!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Profile Admin</h1>
            <p className="text-gray-600 mt-2">Kelola data profile Anda</p>
          </div>

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {successMessage}
            </div>
          )}

          <div className="bg-white rounded-lg shadow p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Depan
                  </label>
                  <input
                    type="text"
                    value={formData.namaDepan}
                    onChange={(e) =>
                      setFormData({ ...formData, namaDepan: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.namaDepan && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.namaDepan}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Belakang
                  </label>
                  <input
                    type="text"
                    value={formData.namaBelakang}
                    onChange={(e) =>
                      setFormData({ ...formData, namaBelakang: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.namaBelakang && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.namaBelakang}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    value={formData.tanggalLahir}
                    onChange={(e) =>
                      setFormData({ ...formData, tanggalLahir: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jenis Kelamin
                  </label>
                  <select
                    value={formData.jenisKelamin}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                       jenisKelamin: 'Laki-laki' as const
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password (Opsional)
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Kosongkan jika tidak ingin mengubah password"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password}
                  </p>
                )}
                <p className="text-gray-500 text-sm mt-2">
                  Minimal 6 karakter
                </p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center disabled:opacity-50"
              >
                <Save className="w-5 h-5 mr-2" />
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}