import AdminPanel from "./admin-panel";

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>
      <AdminPanel />
    </div>
  );
}
