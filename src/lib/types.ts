export interface Admin {
  id: string;
  namaDepan: string;
  namaBelakang: string;
  email: string;
  tanggalLahir: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  password: string;
}

export interface Pegawai {
  id: string;
  namaDepan: string;
  namaBelakang: string;
  email: string;
  noHP: string;
  alamat: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
}

export interface Cuti {
  id: string;
  pegawaiId: string;
  alasanCuti: string;
  tanggalMulai: string;
  tanggalSelesai: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}