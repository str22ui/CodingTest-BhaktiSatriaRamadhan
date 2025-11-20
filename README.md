Aplikasi Manajemen Cuti Pegawai
Aplikasi web untuk mengelola data cuti pegawai dengan sistem CRUD lengkap, validasi data, dan authentication.
🎯 Deskripsi
Aplikasi ini dirancang untuk memudahkan HR dalam mengelola:

Data admin dengan sistem login
Data pegawai perusahaan
Data cuti pegawai dengan validasi rules otomatis
Dashboard untuk monitoring

✨ Fitur Utama
🔐 Authentication & Admin Management

Login dan logout system untuk admin
Create, Read, Update, Delete admin
Edit profile dan password admin
Session management dengan localStorage

👥 Employee Management

Tambah pegawai baru
Edit data pegawai
Hapus pegawai
List semua pegawai
Validasi email dan no HP

🗓️ Leave Management

Tambah cuti baru
Edit data cuti
Hapus data cuti
List cuti per pegawai
Validasi Otomatis:

Maksimal 12 hari cuti per tahun
Maksimal 1 hari cuti per bulan
Tidak bisa cuti di masa lalu



📊 Dashboard

Statistik jumlah pegawai dan cuti
Preview data terbaru
Overview HR metrics

🎨 User Interface

Responsive design (mobile-friendly)
Modern UI dengan Tailwind CSS
Sidebar navigation
Modal forms untuk CRUD
Error handling & validation messages

🛠️ Tech Stack
KategoriTeknologiFrontend FrameworkNext.js 14+ (React)LanguageTypeScriptStylingTailwind CSS v4IconsLucide ReactDate Handlingdate-fnsState ManagementReact HooksData StorageMock API (localStorage)
📋 Requirements
Aplikasi telah memenuhi semua requirements dari test:

✅ CRUD Admin dengan login system
✅ CRUD Pegawai
✅ CRUD Cuti dengan validasi rules
✅ List pegawai dengan masing-masing cuti
✅ Validasi data input lengkap
✅ Frontend menggunakan NextJS
✅ Mock API untuk pemanggilan data

🚀 Quick Start
Prerequisites

Node.js 16+
npm atau yarn