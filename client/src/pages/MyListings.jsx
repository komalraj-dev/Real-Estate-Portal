import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from "react-icons/hi";

const statusColor = {
  Available: "bg-sage/10 text-sage",
  Sold: "bg-red-100 text-red-600",
  Rented: "bg-brass/10 text-brass-600",
};

const MyListings = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get("/properties/my-listings")
      .then(({ data }) => setProperties(data))
      .catch(() => toast.error("Failed to load your listings"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this property permanently?")) return;
    try {
      await api.delete(`/properties/${id}`);
      setProperties(properties.filter((p) => p._id !== id));
      toast.success("Property deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) {
    return <div className="text-sm text-ink/50">Loading your listings...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-medium">My Listed Properties</h2>
        <Link to="/dashboard/add-property" className="btn-primary !py-2 !px-4 text-sm">
          + Add Property
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed border-stone-line rounded-sm">
          <p className="font-display text-xl mb-2">You haven't listed any properties</p>
          <p className="text-sm text-ink/60 mb-6">List your first property and reach thousands of buyers.</p>
          <Link to="/dashboard/add-property" className="btn-outline">List a Property</Link>
        </div>
      ) : (
        <div className="bg-white border border-stone-line rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-bg text-left text-xs font-mono uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-5 py-3">Property</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Active</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p._id} className="border-t border-stone-line">
                  <td className="px-5 py-4">
                    <p className="font-medium text-ink">{p.title}</p>
                    <p className="text-xs text-ink/50">{p.city}, {p.state}</p>
                  </td>
                  <td className="px-5 py-4 font-mono">₹{p.price.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${p.isActive ? "bg-sage/10 text-sage" : "bg-ink/10 text-ink/50"}`}>
                      {p.isActive ? "Live" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <Link to={`/property/${p._id}`} title="View" className="text-ink/50 hover:text-brass"><HiOutlineEye size={18} /></Link>
                      <Link to={`/dashboard/edit-property/${p._id}`} title="Edit" className="text-ink/50 hover:text-brass"><HiOutlinePencil size={18} /></Link>
                      <button onClick={() => handleDelete(p._id)} title="Delete" className="text-ink/50 hover:text-red-500"><HiOutlineTrash size={18} /></button>
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

export default MyListings;
