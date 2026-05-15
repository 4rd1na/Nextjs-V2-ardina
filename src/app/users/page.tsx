"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { X } from "lucide-react";
import TableSkeleton from "@/components/TableSkeleton";
import Link from "next/link";

// Type definition
type User = {
  id: number;
  name: string;
  email: string;
  kelas: string;
  tanggal_lahir: string;
  role: "Admin" | "Siswa";
};

// Data Dummy sesuai screenshot (logic i % 10 dll)
const dummyUsers: User[] = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@sekolah.com`,
  kelas: `Kelas ${((i % 6) + 1)}`,
  tanggal_lahir: `200${i % 10}-0${(i % 9) + 1}-15`,
  role: i % 3 === 0 ? "Admin" : "Siswa",
}));

const ITEMS_PER_PAGE = 5;

function UsersPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State tabel & modal
  const [isLoading, setIsLoading] = useState(false);
  const [selectedQR, setSelectedQR] = useState<User | null>(null);

  // State untuk tombol filter & filter data
  const [showFilter, setShowFilter] = useState(false);
  const [kelasFilter, setKelasFilter] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [tanggalLahirAwal, setTanggalLahirAwal] = useState<string | null>(null);
  const [tanggalLahirAkhir, setTanggalLahirAkhir] = useState<string | null>(null);

  // 1. State untuk Pencarian dan Debounce
  const [searchQuery, setSearchQuery] = useState("");
  const [debounceQuery, setDebounceQuery] = useState("");

  // 2. Filter data pencarian
  const filteredUsers = dummyUsers.filter((user) => {
    const query = debounceQuery.toLowerCase();

    const matchQuery =
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.kelas.toLowerCase().includes(query) ||
      user.tanggal_lahir.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query);

    const matchKelas = kelasFilter ? user.kelas === kelasFilter : true;
    const matchRole = roleFilter ? user.role === roleFilter : true;
    const matchTanggalLahirAwal = tanggalLahirAwal ? user.tanggal_lahir >= tanggalLahirAwal : true;
    const matchTanggalLahirAkhir = tanggalLahirAkhir ? user.tanggal_lahir <= tanggalLahirAkhir : true;

    if (!matchKelas || !matchRole || !matchTanggalLahirAwal || !matchTanggalLahirAkhir) {
      return false;
    }

    return matchQuery;
  });

  // 3. Logic Pagination
  const page = Number(searchParams.get("page")) || 1;
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentData = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  // 4. Reset ke halaman 1 saat search/filter berubah
  useEffect(() => {
    if (page !== 1) {
      router.push(`/users?page=1`);
    }
  }, [debounceQuery, kelasFilter, roleFilter, tanggalLahirAwal, tanggalLahirAkhir]);

  // 5. Efek Loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [page, debounceQuery]);

  // Fungsi Reset Filter (Screenshot terakhir)
  const handleResetFilter = () => {
    setKelasFilter(null);
    setRoleFilter(null);
    setTanggalLahirAwal(null);
    setTanggalLahirAkhir(null);
  };

  const handlePageChange = (newPage: number) => {
    router.push(`/users?page=${newPage}`);
  };

  const getQRCodeUrl = (user: User) => {
    const data = `ID: ${user.id}\nName: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}`;
    return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(data)}&size=1000x1000`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-600">Daftar Users</h1>
          <Link href="/" className="text-indigo-600 hover:underline text-sm">
            &larr; Kembali ke Home
          </Link>
        </div>

        {/* Pencarian & Filter Button */}
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Cari berdasarkan nama, email, atau role..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                const timer = setTimeout(() => {
                  setDebounceQuery(e.target.value);
                }, 300);
                return () => clearTimeout(timer);
              }}
            />
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="bg-gray-100 px-4 rounded-md border text-gray-700 hover:bg-gray-200"
            >
              Filter
            </button>
          </div>

          {/* Tampilan Filter (Screenshot 14-17) */}
          {showFilter && (
            <div className="mt-2 p-4 border rounded-lg bg-gray-50 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {/* Select Kelas */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-600">Kelas</label>
                  <select
                    className="border rounded-md px-2 py-1.5 text-sm bg-white"
                    onChange={(e) => setKelasFilter(e.target.value || null)}
                    value={kelasFilter || ""}
                  >
                    <option value="">Semua Kelas</option>
                    <option value="Kelas 1">Kelas 1</option>
                    <option value="Kelas 2">Kelas 2</option>
                    <option value="Kelas 3">Kelas 3</option>
                    <option value="Kelas 4">Kelas 4</option>
                    <option value="Kelas 5">Kelas 5</option>
                    <option value="Kelas 6">Kelas 6</option>
                  </select>
                </div>

                {/* Select Role */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-600">Role</label>
                  <select
                    className="border rounded-md px-2 py-1.5 text-sm bg-white"
                    onChange={(e) => setRoleFilter(e.target.value || null)}
                    value={roleFilter || ""}
                  >
                    <option value="">Semua Role</option>
                    <option value="Admin">Admin</option>
                    <option value="Siswa">Siswa</option>
                  </select>
                </div>
              </div>

              {/* Range Tanggal Lahir */}
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-600">Dari Tanggal</label>
                  <input
                    type="date"
                    className="border rounded-md px-2 py-1 text-sm bg-white"
                    onChange={(e) => setTanggalLahirAwal(e.target.value || null)}
                    value={tanggalLahirAwal || ""}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-600">Sampai Tanggal</label>
                  <input
                    type="date"
                    className="border rounded-md px-2 py-1 text-sm bg-white"
                    onChange={(e) => setTanggalLahirAkhir(e.target.value || null)}
                    value={tanggalLahirAkhir || ""}
                  />
                </div>
              </div>

              <button
                onClick={handleResetFilter}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-sm hover:underline font-medium "
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>

        {/* Tabel Users */}
        <div className="border rounded-lg overflow-x-auto min-h-[300px] relative">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 font-semibold uppercase">
              <tr>
                <th className="p-4 border-b">ID</th>
                <th className="p-4 border-b">Nama Lengkap</th>
                <th className="p-4 border-b">Email</th>
                <th className="p-4 border-b">Kelas</th>
                <th className="p-4 border-b">Tanggal Lahir</th>
                <th className="p-4 border-b">Role</th>
                <th className="p-4 border-b text-center">QR Code</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <TableSkeleton />
              ) : (
                currentData.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition border-b last:border-0">
                    <td className="p-4">{user.id}</td>
                    <td className="p-4 font-semibold text-gray-900">{user.name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{user.kelas}</td>
                    <td className="p-4">{user.tanggal_lahir}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === "Admin" ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"
                        }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        <img
                          src={getQRCodeUrl(user)}
                          alt="QR Code"
                          className="w-10 h-10 cursor-pointer hover:scale-110 transition border rounded p-0.5 bg-white"
                          onClick={() => setSelectedQR(user)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {!isLoading && currentData.length === 0 && (
            <div className="p-8 text-center text-gray-500">Data tidak ditemukan.</div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <span className="text-sm text-gray-500">
            Halaman <b>{page}</b> dari <b>{totalPages}</b>
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Prev
            </button>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages || totalPages === 0}
              className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal QR Code */}
      {selectedQR && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedQR(null)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-sm w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedQR(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold text-gray-800 mb-1">{selectedQR.name}</h2>
            <p className="text-xs text-gray-500 mb-4">{selectedQR.email}</p>
            <div className="flex justify-center bg-gray-50 p-4 rounded-lg border">
              <img src={getQRCodeUrl(selectedQR)} alt="QR Large" className="w-48 h-48" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Wrapper dengan Suspense boundary
export default function UsersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 p-8 font-sans">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    }>
      <UsersPageContent />
    </Suspense>
  );
}