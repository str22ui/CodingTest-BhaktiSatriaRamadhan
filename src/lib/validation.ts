export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password: string): string | null => {
  if (password.length < 6) return 'Password minimal 6 karakter';
  return null;
};

export const validatePhone = (phone: string): boolean => {
  const re = /^(\+62|62|0)[0-9]{9,12}$/;
  return re.test(phone);
};

export const validateName = (name: string): boolean => {
  return name.trim().length > 0 && name.length <= 50;
};

export const validateDateRange = (
  startDate: string,
  endDate: string
): string | null => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start > end) return 'Tanggal mulai harus sebelum tanggal selesai';
  if (start < new Date()) return 'Tanggal mulai tidak boleh di masa lalu';

  const daysDiff = Math.floor(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysDiff > 12) return 'Maksimal cuti 12 hari dalam setahun';

  return null;
};

export const validateCutiRules = (
  allCuti: Array<{ tanggalMulai: string; tanggalSelesai: string }>,
  newStart: string,
  newEnd: string
): string | null => {
  const year = new Date(newStart).getFullYear();

  const totalDays = allCuti.reduce((sum, c) => {
    const start = new Date(c.tanggalMulai);
    const end = new Date(c.tanggalSelesai);
    if (start.getFullYear() === year) {
      const days = Math.floor(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );
      return sum + days;
    }
    return sum;
  }, 0);

  const newDays = Math.floor(
    (new Date(newEnd).getTime() - new Date(newStart).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  if (totalDays + newDays > 12) {
    return `Sisa cuti tahun ini hanya ${12 - totalDays} hari`;
  }

  const newMonth = new Date(newStart).toISOString().slice(0, 7);
  const hasMonthCuti = allCuti.some(
    (c) => c.tanggalMulai.slice(0, 7) === newMonth
  );

  if (hasMonthCuti) {
    return 'Hanya bisa menggunakan cuti maksimal 1 hari per bulan';
  }

  return null;
};