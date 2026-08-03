import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { HiOutlineMenu, HiOutlineX, HiOutlineHeart, HiOutlineUser } from "react-icons/hi";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/listings", label: "Listings" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `text-sm tracking-wide font-medium transition-colors ${
      isActive ? "text-brass" : "text-ink hover:text-brass"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-stone-bg/95 backdrop-blur border-b border-stone-line">
      <div className="container-xl flex items-center justify-between h-20">
        <Link to="/" className="font-display text-2xl font-semibold tracking-tight text-ink">
          Estate<span className="text-brass">ly</span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-5">
          {user ? (
            <>
              <Link to="/dashboard/favorites" title="Favorites" className="text-ink hover:text-brass">
                <HiOutlineHeart size={22} />
              </Link>
              <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-ink hover:text-brass">
                <HiOutlineUser size={20} />
                {user.name.split(" ")[0]}
              </Link>
              {user.role === "admin" && (
                <Link to="/admin" className="btn-outline !px-4 !py-2 text-xs">
                  Admin
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="text-sm font-medium text-ink/60 hover:text-ink"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-ink hover:text-brass">
                Login
              </Link>
              <Link to="/register" className="btn-primary !px-5 !py-2.5 text-sm">
                Get Started
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden text-ink" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <HiOutlineX size={26} /> : <HiOutlineMenu size={26} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-stone-line bg-stone-bg">
          <div className="container-xl py-4 flex flex-col gap-4">
            {navLinks.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass} onClick={() => setOpen(false)}>
                {l.label}
              </NavLink>
            ))}
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)} className="text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/dashboard/favorites" onClick={() => setOpen(false)} className="text-sm font-medium">
                  Favorites
                </Link>
                {user.role === "admin" && (
                  <Link to="/admin" onClick={() => setOpen(false)} className="text-sm font-medium">
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                    navigate("/");
                  }}
                  className="text-sm font-medium text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="text-sm font-medium">
                  Login
                </Link>
                <Link to="/register" onClick={() => setOpen(false)} className="btn-primary w-fit !px-5 !py-2.5 text-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
