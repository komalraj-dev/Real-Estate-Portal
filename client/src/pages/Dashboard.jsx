import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HiOutlineUser, HiOutlineHeart, HiOutlineHome, HiOutlinePlusCircle } from "react-icons/hi";

const links = [
  { to: "/dashboard", label: "Profile", icon: HiOutlineUser, end: true },
  { to: "/dashboard/my-listings", label: "My Listings", icon: HiOutlineHome },
  { to: "/dashboard/favorites", label: "Favorites", icon: HiOutlineHeart },
  { to: "/dashboard/add-property", label: "Add Property", icon: HiOutlinePlusCircle },
];

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container-xl py-10 md:py-14">
      <div className="mb-8">
        <p className="section-eyebrow mb-2">Dashboard</p>
        <h1 className="font-display text-3xl font-medium">Welcome back, {user?.name?.split(" ")[0]}</h1>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        <aside className="bg-white border border-stone-line rounded-sm p-3 h-fit lg:sticky lg:top-24">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto">
            {links.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-sm text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive ? "bg-ink text-white" : "text-ink/70 hover:bg-stone-bg"
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
