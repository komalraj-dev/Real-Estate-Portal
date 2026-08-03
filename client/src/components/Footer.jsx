import { Link } from "react-router-dom";
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from "react-icons/hi";

const Footer = () => {
  return (
    <footer className="bg-ink text-white mt-24">
      <div className="container-xl py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h3 className="font-display text-2xl font-semibold mb-3">
            Estate<span className="text-brass">ly</span>
          </h3>
          <p className="text-sm text-white/60 leading-relaxed">
            A curated marketplace for buying, selling, and renting properties —
            built for people who take their next move seriously.
          </p>
        </div>

        <div>
          <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-brass mb-4">Explore</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/listings" className="hover:text-white">All Listings</Link></li>
            <li><Link to="/listings?purpose=Sale" className="hover:text-white">Buy a Home</Link></li>
            <li><Link to="/listings?purpose=Rent" className="hover:text-white">Rent a Home</Link></li>
            <li><Link to="/register" className="hover:text-white">List Your Property</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-brass mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/#why-us" className="hover:text-white">Why Choose Us</Link></li>
            <li><Link to="/#faq" className="hover:text-white">FAQ</Link></li>
            <li><Link to="/#testimonials" className="hover:text-white">Testimonials</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-brass mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-center gap-2"><HiOutlineMail /> hello@estately.com</li>
            <li className="flex items-center gap-2"><HiOutlinePhone /> +91 98765 43210</li>
            <li className="flex items-center gap-2"><HiOutlineLocationMarker /> Bengaluru, India</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Estately. Final year academic project — not a licensed real estate brokerage.
      </div>
    </footer>
  );
};

export default Footer;
