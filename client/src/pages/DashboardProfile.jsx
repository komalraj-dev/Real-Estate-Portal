import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import toast from "react-hot-toast";

const DashboardProfile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "" });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { data } = await api.put("/auth/profile", form);
      updateUser(data);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) {
      return toast.error("New passwords do not match");
    }
    setSavingPw(true);
    try {
      await api.put("/auth/change-password", {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      toast.success("Password changed");
      setPwForm({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Password change failed");
    } finally {
      setSavingPw(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white border border-stone-line rounded-sm p-6 md:p-8">
        <h2 className="font-display text-xl font-medium mb-6">Edit Profile</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="text-xs font-mono uppercase tracking-wide text-ink/50">Full Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field mt-1" />
          </div>
          <div>
            <label className="text-xs font-mono uppercase tracking-wide text-ink/50">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field mt-1" />
          </div>
          <div>
            <label className="text-xs font-mono uppercase tracking-wide text-ink/50">Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field mt-1" />
          </div>
          <button type="submit" disabled={savingProfile} className="btn-primary disabled:opacity-60">
            {savingProfile ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      <div className="bg-white border border-stone-line rounded-sm p-6 md:p-8">
        <h2 className="font-display text-xl font-medium mb-6">Change Password</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="text-xs font-mono uppercase tracking-wide text-ink/50">Current Password</label>
            <input type="password" required value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} className="input-field mt-1" />
          </div>
          <div>
            <label className="text-xs font-mono uppercase tracking-wide text-ink/50">New Password</label>
            <input type="password" required value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} className="input-field mt-1" />
          </div>
          <div>
            <label className="text-xs font-mono uppercase tracking-wide text-ink/50">Confirm New Password</label>
            <input type="password" required value={pwForm.confirm} onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })} className="input-field mt-1" />
          </div>
          <button type="submit" disabled={savingPw} className="btn-outline disabled:opacity-60">
            {savingPw ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardProfile;
