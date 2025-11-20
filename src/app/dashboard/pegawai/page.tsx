'use client';

import { useEffect, useState } from 'react';
import {
  getPegawais,
  createPegawai,
  updatePegawai,
  deletePegawai,
} from '@/lib/api';
import {
  validateEmail,
  validateName,
  validatePhone,
} from '@/lib/validation';
import { Pegawai } from '@/lib/types';
import DashboardLayout from '@/components/DashboardLayout';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

type JenisKelamin = 'Laki-laki' | 'Perempuan';

export default function PegawaiPage() {
  const [pegawais, setPegawais] = useState<Pegawai[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<{
    namaDepan: string;
    namaBelakang: string;
    email: string;
    noHP: string;
    alamat: string;
    jenisKelamin: JenisKelamin;
  }>({
    namaDepan: '',
    namaBelakang: '',
    email: '',
    noHP: '',
    alamat: '',
    jenisKelamin: 'Laki-laki',
  });

  useEffect(() => {
    const fetchPegawais = async () => {
      setLoading(true);
      const res = await getPegawais();
      if (res.success) setPegawais(res.data || []);
      setLoading(false);
    };
    fetchPegawais();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!validateName(formData.namaDepan))
      newErrors.namaDepan = 'Nama depan tidak valid';
    if (!validateName(formData.namaBelakang))
      newErrors.namaBelakang = 'Nama belakang tidak valid';
    if (!validateEmail(formData.email))
      newErrors.email = 'Email tidak valid';
    if (!validatePhone(formData.noHP))
      newErrors.noHP = 'No HP tidak valid';
    if (!formData.alamat.trim()) newErrors.alamat = 'Alamat harus diisi';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (editingId) {
        await updatePegawai(editingId, formData);
      } else {
        await createPegawai(formData);
      }

      const res = await getPegawais();
      if (res.success) setPegawais(res.data || []);
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      namaDepan: '',
      namaBelakang: '',
      email: '',
      noHP: '',
      alamat: '',
      jenisKelamin: 'Laki-laki',
    });
    setEditingId(null);
    setErrors({});
  };

  const handleEdit = (pegawai: Pegawai) => {
    setFormData({
      namaDepan: pegawai.namaDepan,
      namaBelakang: pegawai.namaBelakang,
      email: pegawai.email,
      noHP: pegawai.noHP,
      alamat: pegawai.alamat,
      jenisKelamin: pegawai.jenisKelamin,
    });
    setEditingId(pegawai.id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      await deletePegawai(id);
      const res = await getPegawais();
      if (res.success) setPegawais(res.data || []);
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Data Pegawai</h1>
            <p className="text-gray-600 mt-2">Kelola data pegawai perusahaan</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5 mr-2" />
            Tambah Pegawai
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {pegawais.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Nama
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      No HP
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Alamat
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {pegawais.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {p.namaDepan} {p.namaBelakang}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {p.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {p.noHP}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {p.alamat}
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition inline-flex items-center"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition inline-flex items-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Tidak ada data pegawai
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
       <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {editingId ? 'Edit Pegawai' : 'Tambah Pegawai'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Depan
                </label>
                <input
                  type="text"
                  value={formData.namaDepan}
                  onChange={(e) =>
                    setFormData({ ...formData, namaDepan: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.namaDepan && (
                  <p className="text-red-500 text-sm mt-1">{errors.namaDepan}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Belakang
                </label>
                <input
                  type="text"
                  value={formData.namaBelakang}
                  onChange={(e) =>
                    setFormData({ ...formData, namaBelakang: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.namaBelakang && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.namaBelakang}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  No HP
                </label>
                <input
                  type="tel"
                  value={formData.noHP}
                  onChange={(e) =>
                    setFormData({ ...formData, noHP: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="08123456789"
                />
                {errors.noHP && (
                  <p className="text-red-500 text-sm mt-1">{errors.noHP}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat
                </label>
                <textarea
                  value={formData.alamat}
                  onChange={(e) =>
                    setFormData({ ...formData, alamat: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                {errors.alamat && (
                  <p className="text-red-500 text-sm mt-1">{errors.alamat}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jenis Kelamin
                </label>
                <select
                  value={formData.jenisKelamin}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      jenisKelamin: e.target.value as JenisKelamin,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                {editingId ? 'Update' : 'Tambah'}
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}