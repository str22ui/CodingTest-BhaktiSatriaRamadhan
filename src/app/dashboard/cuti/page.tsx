'use client';

import { useEffect, useState } from 'react';
import {
  getPegawais,
  getCutis,
  createCuti,
  updateCuti,
  deleteCuti,
} from '@/lib/api';
import { validateCutiRules, validateDateRange } from '@/lib/validation';
import { Pegawai, Cuti } from '@/lib/types';
import DashboardLayout from '@/components/DashboardLayout';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export default function CutiPage() {
  const [pegawais, setPegawais] = useState<Pegawai[]>([]);
  const [cutis, setCutis] = useState<Cuti[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    pegawaiId: '',
    alasanCuti: '',
    tanggalMulai: '',
    tanggalSelesai: '',
  });

  const fetchData = async () => {
  setLoading(true);

  const pegRes = await getPegawais();
  const cutiRes = await getCutis();

  if (pegRes.success) setPegawais(pegRes.data || []);
  if (cutiRes.success) setCutis(cutiRes.data || []);

  setLoading(false);
};


 useEffect(() => {
  let isMounted = true;

  const load = async () => {
    await fetchData();
  };

  load();

  return () => {
    isMounted = false;
  };
}, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.pegawaiId) newErrors.pegawaiId = 'Pilih pegawai';
    if (!formData.alasanCuti.trim()) newErrors.alasanCuti = 'Alasan harus diisi';
    if (!formData.tanggalMulai)
      newErrors.tanggalMulai = 'Tanggal mulai harus diisi';
    if (!formData.tanggalSelesai)
      newErrors.tanggalSelesai = 'Tanggal selesai harus diisi';

    const rangeError = validateDateRange(
      formData.tanggalMulai,
      formData.tanggalSelesai
    );
    if (rangeError) newErrors.dates = rangeError;

    const pegawaiCutis = cutis.filter((c) => c.pegawaiId === formData.pegawaiId);
    const cutiError = validateCutiRules(
      pegawaiCutis,
      formData.tanggalMulai,
      formData.tanggalSelesai
    );
    if (cutiError) newErrors.rules = cutiError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (editingId) {
        await updateCuti(editingId, formData);
      } else {
        await createCuti(formData);
      }

      await fetchData();
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      pegawaiId: '',
      alasanCuti: '',
      tanggalMulai: '',
      tanggalSelesai: '',
    });
    setEditingId(null);
    setErrors({});
  };

  const handleEdit = (cuti: Cuti) => {
    setFormData(cuti);
    setEditingId(cuti.id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      await deleteCuti(id);
      await fetchData();
    }
  };

  const getPegawaiName = (pegawaiId: string) => {
    const pegawai = pegawais.find((p) => p.id === pegawaiId);
    return pegawai
      ? `${pegawai.namaDepan} ${pegawai.namaBelakang}`
      : 'Unknown';
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
            <h1 className="text-3xl font-bold text-gray-800">Data Cuti</h1>
            <p className="text-gray-600 mt-2">Kelola cuti pegawai perusahaan</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5 mr-2" />
            Tambah Cuti
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {cutis.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Pegawai
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Alasan
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Tanggal Mulai
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Tanggal Selesai
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Durasi
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {cutis.map((c) => {
                    const days = Math.floor(
                      (new Date(c.tanggalSelesai).getTime() -
                        new Date(c.tanggalMulai).getTime()) /
                        (1000 * 60 * 60 * 24)
                    );
                    return (
                      <tr key={c.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-800">
                          {getPegawaiName(c.pegawaiId)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">
                          {c.alasanCuti}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">
                          {new Date(c.tanggalMulai).toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">
                          {new Date(c.tanggalSelesai).toLocaleDateString(
                            'id-ID'
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {days} hari
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          <button
                            onClick={() => handleEdit(c)}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition inline-flex items-center"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition inline-flex items-center"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Tidak ada data cuti
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
                {editingId ? 'Edit Cuti' : 'Tambah Cuti'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pegawai
                </label>
                <select
                  value={formData.pegawaiId}
                  onChange={(e) =>
                    setFormData({ ...formData, pegawaiId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Pegawai</option>
                  {pegawais.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.namaDepan} {p.namaBelakang}
                    </option>
                  ))}
                </select>
                {errors.pegawaiId && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.pegawaiId}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alasan Cuti
                </label>
                <input
                  type="text"
                  value={formData.alasanCuti}
                  onChange={(e) =>
                    setFormData({ ...formData, alasanCuti: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Cuti Tahunan, Sakit, dll"
                />
                {errors.alasanCuti && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.alasanCuti}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Mulai
                </label>
                <input
                  type="date"
                  value={formData.tanggalMulai}
                  onChange={(e) =>
                    setFormData({ ...formData, tanggalMulai: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.tanggalMulai && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.tanggalMulai}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Selesai
                </label>
                <input
                  type="date"
                  value={formData.tanggalSelesai}
                  onChange={(e) =>
                    setFormData({ ...formData, tanggalSelesai: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.tanggalSelesai && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.tanggalSelesai}
                  </p>
                )}
              </div>

              {errors.dates && (
                <p className="text-red-500 text-sm">{errors.dates}</p>
              )}
              {errors.rules && (
                <p className="text-red-500 text-sm">{errors.rules}</p>
              )}

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