import { useEffect, useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import {
  HiOutlineUsers, HiOutlineHome, HiOutlineTag, HiOutlineKey,
  HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineTrash, HiOutlineStar,
} from "react-icons/hi";

const TABS = ["Overview", "Properties", "Users"];

const StatCard = ({ label, value, icon: Icon }) => (
  <div className="bg-white border border-stone-line rounded-sm p-5">
    <div className="flex items-center justify-between mb-3">
      <Icon className="text-brass" size={22} />
    </div>
    <p className="font-display text-3xl font-medium">{value}</p>
    <p className="text-xs text-ink/50 mt-1 font-mono uppercase tracking-wide">{label}</p>
  </div>
);

const AdminDashboard = () => {
  const [tab, setTab] = useState("Overview");
  const [stats, setStats] = useState(null);
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadStats = () => api.get("/admin/stats").then(({ data }) => setStats(data));
  const loadProperties = () => api.get("/admin/properties").then(({ data }) => setProperties(data));
  const loadUsers = () => api.get("/admin/users").then(({ data }) => setUsers(data));

  useEffect(() => {
    setLoading(true);
    Promise.all([loadStats(), loadProperties(), loadUsers()])
      .catch(() => toast.error("Failed to load admin data"))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/properties/${id}/status`, { status });
      setProperties(properties.map((p) => (p._id === id ? { ...p, status } : p)));
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const toggleActive = async (id) => {
    try {
      const { data } = await api.put(`/admin/properties/${id}/toggle-active`);
      setProperties(properties.map((p) => (p._id === id ? data : p)));
    } catch {
      toast.error("Failed to toggle listing");
    }
  };

  const toggleFeatured = async (id) => {
    try {
      const { data } = await api.put(`/admin/properties/${id}/toggle-featured`);
      setProperties(properties.map((p) => (p._id === id ? data : p)));
    } catch {
      toast.error("Failed to toggle featured");
    }
  };

  const deleteProperty = async (id) => {
    if (!window.confirm("Delete this property permanently?")) return;
    try {
      await api.delete(`/admin/properties/${id}`);
      setProperties(properties.filter((p) => p._id !== id));
      toast.success("Property deleted");
    } catch {
      toast.error("Failed to delete property");
    }
  };

  const toggleBlockUser = async (id) => {
    try {
      const { data } = await api.put(`/admin/users/${id}/block`);
      setUsers(users.map((u) => (u._id === id ? data.user : u)));
      toast.success(data.message);
    } catch {
      toast.error("Failed to update user");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
      toast.success("User deleted");
    } catch {
      toast.error("Failed to delete user");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container-xl py-10 md:py-14">
      <div className="mb-8">
        <p className="section-eyebrow mb-2">Admin</p>
        <h1 className="font-display text-3xl font-medium">Control Panel</h1>
      </div>

      <div className="flex gap-2 mb-8 border-b border-stone-line">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t ? "border-brass text-ink" : "border-transparent text-ink/50 hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && stats && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Users" value={stats.totalUsers} icon={HiOutlineUsers} />
          <StatCard label="Total Properties" value={stats.totalProperties} icon={HiOutlineHome} />
          <StatCard label="For Sale" value={stats.totalSale} icon={HiOutlineTag} />
          <StatCard label="For Rent" value={stats.totalRental} icon={HiOutlineKey} />
          <StatCard label="Available" value={stats.available} icon={HiOutlineCheckCircle} />
          <StatCard label="Sold" value={stats.sold} icon={HiOutlineXCircle} />
          <StatCard label="Rented" value={stats.rented} icon={HiOutlineKey} />
        </div>
      )}

      {tab === "Properties" && (
        <div className="bg-white border border-stone-line rounded-sm overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-stone-bg text-left text-xs font-mono uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-5 py-3">Property</th>
                <th className="px-5 py-3">Owner</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Active</th>
                <th className="px-5 py-3">Featured</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p._id} className="border-t border-stone-line">
                  <td className="px-5 py-4">
                    <p className="font-medium">{p.title}</p>
                    <p className="text-xs text-ink/50">{p.city}, {p.state} · {p.propertyType}</p>
                  </td>
                  <td className="px-5 py-4 text-ink/70">{p.owner?.name || "—"}</td>
                  <td className="px-5 py-4">
                    <select
                      value={p.status}
                      onChange={(e) => updateStatus(p._id, e.target.value)}
                      className="text-xs border border-stone-line rounded-sm px-2 py-1"
                    >
                      <option value="Available">Available</option>
                      <option value="Sold">Sold</option>
                      <option value="Rented">Rented</option>
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => toggleActive(p._id)} className={`text-xs px-2.5 py-1 rounded-full font-medium ${p.isActive ? "bg-sage/10 text-sage" : "bg-ink/10 text-ink/50"}`}>
                      {p.isActive ? "Live" : "Hidden"}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => toggleFeatured(p._id)} title="Toggle featured">
                      <HiOutlineStar size={18} className={p.isFeatured ? "text-brass fill-brass" : "text-ink/30"} />
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => deleteProperty(p._id)} className="text-ink/50 hover:text-red-500">
                      <HiOutlineTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "Users" && (
        <div className="bg-white border border-stone-line rounded-sm overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-stone-bg text-left text-xs font-mono uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t border-stone-line">
                  <td className="px-5 py-4 font-medium">{u.name}</td>
                  <td className="px-5 py-4 text-ink/70">{u.email}</td>
                  <td className="px-5 py-4 capitalize text-ink/70">{u.role}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${u.isBlocked ? "bg-red-100 text-red-600" : "bg-sage/10 text-sage"}`}>
                      {u.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-4">
                      {u.role !== "admin" && (
                        <>
                          <button onClick={() => toggleBlockUser(u._id)} className="text-xs font-medium text-ink/60 hover:text-ink">
                            {u.isBlocked ? "Unblock" : "Block"}
                          </button>
                          <button onClick={() => deleteUser(u._id)} className="text-ink/50 hover:text-red-500">
                            <HiOutlineTrash size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
