/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { Admin, Pegawai, Cuti, ApiResponse } from './types';


let admins: Admin[] = [
  {
    id: '1',
    namaDepan: 'Bhakti',
    namaBelakang: 'Satria',
    email: 'admin@gmail.com',
    tanggalLahir: '2002-11-22',
    jenisKelamin: 'Laki-laki',
    password: 'password123',
  },
];

let pegawais: Pegawai[] = [
  {
    id: '1',
    namaDepan: 'James',
    namaBelakang: 'Santoso',
    email: 'james@gmail.com',
    noHP: '08123456789',
    alamat: 'Jl. Merdeka No. 1',
    jenisKelamin: 'Laki-laki',
  },
  {
    id: '2',
    namaDepan: 'Siti',
    namaBelakang: 'Nurhaliza',
    email: 'siti@gmail.com',
    noHP: '08987654321',
    alamat: 'Jl. Sudirman No. 2',
    jenisKelamin: 'Perempuan',
  },
];

let cutis: Cuti[] = [];

// ADMIN APIs
export const loginAdmin = async (
  email: string,
  password: string
): Promise<ApiResponse<Admin>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const admin = admins.find(
        (a) => a.email === email && a.password === password
      );
      if (admin) {
        const { password, ...adminData } = admin;
        resolve({ success: true, data: adminData as any });
      } else {
        resolve({ success: false, message: 'Email atau password salah' });
      }
    }, 500);
  });
};

export const getAdmins = async (): Promise<ApiResponse<Admin[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const adminList = admins.map(({ password, ...admin }) => admin);
      resolve({ success: true, data: adminList as any });
    }, 500);
  });
};

export const createAdmin = async (
  admin: Omit<Admin, 'id'>
): Promise<ApiResponse<Admin>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newAdmin: Admin = {
        ...admin,
        id: Date.now().toString(),
      };
      admins.push(newAdmin);
      const { password, ...data } = newAdmin;
      resolve({ success: true, data: data as any });
    }, 500);
  });
};

export const updateAdmin = async (
  id: string,
  updates: Partial<Admin>
): Promise<ApiResponse<Admin>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = admins.findIndex((a) => a.id === id);
      if (index !== -1) {
        admins[index] = { ...admins[index], ...updates };
        const { password, ...data } = admins[index];
        resolve({ success: true, data: data as any });
      } else {
        resolve({ success: false, message: 'Admin tidak ditemukan' });
      }
    }, 500);
  });
};

export const deleteAdmin = async (id: string): Promise<ApiResponse<null>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = admins.findIndex((a) => a.id === id);
      if (index !== -1) {
        admins.splice(index, 1);
        resolve({ success: true });
      } else {
        resolve({ success: false, message: 'Admin tidak ditemukan' });
      }
    }, 500);
  });
};

// PEGAWAI APIs
export const getPegawais = async (): Promise<ApiResponse<Pegawai[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data: pegawais });
    }, 500);
  });
};

export const createPegawai = async (
  pegawai: Omit<Pegawai, 'id'>
): Promise<ApiResponse<Pegawai>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newPegawai: Pegawai = {
        ...pegawai,
        id: Date.now().toString(),
      };
      pegawais.push(newPegawai);
      resolve({ success: true, data: newPegawai });
    }, 500);
  });
};

export const updatePegawai = async (
  id: string,
  updates: Partial<Pegawai>
): Promise<ApiResponse<Pegawai>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = pegawais.findIndex((p) => p.id === id);
      if (index !== -1) {
        pegawais[index] = { ...pegawais[index], ...updates };
        resolve({ success: true, data: pegawais[index] });
      } else {
        resolve({ success: false, message: 'Pegawai tidak ditemukan' });
      }
    }, 500);
  });
};

export const deletePegawai = async (id: string): Promise<ApiResponse<null>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = pegawais.findIndex((p) => p.id === id);
      if (index !== -1) {
        pegawais.splice(index, 1);
        cutis = cutis.filter((c) => c.pegawaiId !== id);
        resolve({ success: true });
      } else {
        resolve({ success: false, message: 'Pegawai tidak ditemukan' });
      }
    }, 500);
  });
};

// CUTI APIs
export const getCutis = async (
  pegawaiId?: string
): Promise<ApiResponse<Cuti[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = pegawaiId
        ? cutis.filter((c) => c.pegawaiId === pegawaiId)
        : cutis;
      resolve({ success: true, data: filtered });
    }, 500);
  });
};

export const createCuti = async (
  cuti: Omit<Cuti, 'id'>
): Promise<ApiResponse<Cuti>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newCuti: Cuti = {
        ...cuti,
        id: Date.now().toString(),
      };
      cutis.push(newCuti);
      resolve({ success: true, data: newCuti });
    }, 500);
  });
};

export const updateCuti = async (
  id: string,
  updates: Partial<Cuti>
): Promise<ApiResponse<Cuti>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = cutis.findIndex((c) => c.id === id);
      if (index !== -1) {
        cutis[index] = { ...cutis[index], ...updates };
        resolve({ success: true, data: cutis[index] });
      } else {
        resolve({ success: false, message: 'Data cuti tidak ditemukan' });
      }
    }, 500);
  });
};

export const deleteCuti = async (id: string): Promise<ApiResponse<null>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = cutis.findIndex((c) => c.id === id);
      if (index !== -1) {
        cutis.splice(index, 1);
        resolve({ success: true });
      } else {
        resolve({ success: false, message: 'Data cuti tidak ditemukan' });
      }
    }, 500);
  });
};