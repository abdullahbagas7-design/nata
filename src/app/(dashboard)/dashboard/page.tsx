export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700">Selamat Datang</h2>
          <p className="text-gray-500 mt-2">Ini adalah halaman utama sistem manajemen undangan.</p>
        </div>
      </div>
    </div>
  );
}
