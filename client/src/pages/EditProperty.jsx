import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const AMENITY_OPTIONS = [
  "Lift", "Power Backup", "Security", "Gym", "Swimming Pool", "Garden",
  "Club House", "Water Supply", "CCTV", "Terrace", "Borewell", "Gated Layout",
];

const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "");

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get(`/properties/${id}`)
      .then(({ data }) => {
        const p = data.property;
        setForm({
          title: p.title, description: p.description, price: p.price,
          address: p.address, city: p.city, state: p.state, pincode: p.pincode || "",
          propertyType: p.propertyType, purpose: p.purpose, bedrooms: p.bedrooms,
          bathrooms: p.bathrooms, area: p.area, parking: p.parking,
          furnished: p.furnished, amenities: p.amenities || [], status: p.status,
        });
        setExistingImages(p.images || []);
      })
      .catch(() => toast.error("Failed to load property"))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleAmenity = (a) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a) ? prev.amenities.filter((x) => x !== a) : [...prev.amenities, a],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "amenities") fd.append(key, JSON.stringify(value));
        else fd.append(key, value);
      });
      newImages.forEach((file) => fd.append("images", file));

      await api.put(`/properties/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Property updated");
      navigate("/dashboard/my-listings");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !form) return <Loader full={false} />;

  return (
    <div className="bg-white border border-stone-line rounded-sm p-6 md:p-8">
      <h2 className="font-display text-xl font-medium mb-6">Edit Property</h2>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label className="text-xs font-mono uppercase tracking-wide text-ink/50">Title</label>
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field mt-1" />
        </div>

        <div>
          <label className="text-xs font-mono uppercase tracking-wide text-ink/50">Description</label>
          <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field mt-1 resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono uppercase tracking-wide text-ink/50">Price (₹)</label>
            <input required type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field mt-1" />
          </div>
          <div>
            <label className="text-xs font-mono uppercase tracking-wide text-ink/50">Purpose</label>
            <select value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} className="input-field mt-1">
              <option value="Sale">Sale</option>
              <option value="Rent">Rent</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-mono uppercase tracking-wide text-ink/50">Address</label>
          <input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-field mt-1" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-mono uppercase tracking-wide text-ink/50">City</label>
            <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-field mt-1" />
          </div>
          <div>
            <label className="text-xs font-mono uppercase tracking-wide text-ink/50">State</label>
            <input required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="input-field mt-1" />
          </div>
          <div>
            <label className="text-xs font-mono uppercase tracking-wide text-ink/50">Pincode</label>
            <input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} className="input-field mt-1" />
          </div>
        </div>

        <div>
          <label className="text-xs font-mono uppercase tracking-wide text-ink/50">Property Type</label>
          <select value={form.propertyType} onChange={(e) => setForm({ ...form, propertyType: e.target.value })} className="input-field mt-1">
            {["Flat", "Apartment", "Villa", "Bungalow", "House", "Commercial", "Land"].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-mono uppercase tracking-wide text-ink/50">Bedrooms</label>
            <input type="number" min="0" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} className="input-field mt-1" />
          </div>
          <div>
            <label className="text-xs font-mono uppercase tracking-wide text-ink/50">Bathrooms</label>
            <input type="number" min="0" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} className="input-field mt-1" />
          </div>
          <div>
            <label className="text-xs font-mono uppercase tracking-wide text-ink/50">Area (sqft)</label>
            <input required type="number" min="0" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className="input-field mt-1" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 items-end">
          <div>
            <label className="text-xs font-mono uppercase tracking-wide text-ink/50">Furnished Status</label>
            <select value={form.furnished} onChange={(e) => setForm({ ...form, furnished: e.target.value })} className="input-field mt-1">
              <option value="Unfurnished">Unfurnished</option>
              <option value="Semi-Furnished">Semi-Furnished</option>
              <option value="Furnished">Furnished</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm pb-3">
            <input type="checkbox" checked={form.parking} onChange={(e) => setForm({ ...form, parking: e.target.checked })} />
            Parking Available
          </label>
        </div>

        <div>
          <label className="text-xs font-mono uppercase tracking-wide text-ink/50">Status</label>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field mt-1">
            <option value="Available">Available</option>
            <option value="Sold">Sold</option>
            <option value="Rented">Rented</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-mono uppercase tracking-wide text-ink/50 block mb-2">Amenities</label>
          <div className="flex flex-wrap gap-2">
            {AMENITY_OPTIONS.map((a) => (
              <button
                type="button"
                key={a}
                onClick={() => toggleAmenity(a)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  form.amenities.includes(a) ? "bg-ink text-white border-ink" : "border-stone-line text-ink/70 hover:border-ink"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {existingImages.length > 0 && (
          <div>
            <label className="text-xs font-mono uppercase tracking-wide text-ink/50 block mb-2">Current Photos</label>
            <div className="flex flex-wrap gap-3">
              {existingImages.map((img, i) => (
                <img key={i} src={`${API_ORIGIN}${img}`} alt="" className="w-20 h-20 object-cover rounded-sm border border-stone-line" />
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="text-xs font-mono uppercase tracking-wide text-ink/50 block mb-2">Add More Photos</label>
          <input
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => setNewImages(Array.from(e.target.files))}
            className="text-sm"
          />
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
            {submitting ? "Saving..." : "Save Changes"}
          </button>
          <Link to="/dashboard/my-listings" className="btn-outline">Cancel</Link>
        </div>
      </form>
    </div>
  );
};

export default EditProperty;
