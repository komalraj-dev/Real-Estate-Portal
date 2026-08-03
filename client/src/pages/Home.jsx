import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CountUp from "../components/CountUp";
import api from "../utils/api";
import SearchBar from "../components/SearchBar";
import PropertyCard from "../components/PropertyCard";
import SkeletonCard from "../components/SkeletonCard";
import {
  PiBuildingApartmentLight,
  PiHouseLineLight,
  PiTreeLight,
  PiBuildingsLight,
} from "react-icons/pi";
import { HiOutlineShieldCheck, HiOutlineCash, HiOutlineChatAlt2, HiOutlineChevronDown } from "react-icons/hi";

const categories = [
  { label: "Apartments", type: "Apartment", icon: PiBuildingApartmentLight },
  { label: "Villas", type: "Villa", icon: PiHouseLineLight },
  { label: "Land", type: "Land", icon: PiTreeLight },
  { label: "Commercial", type: "Commercial", icon: PiBuildingsLight },
];

const whyUs = [
  {
    icon: HiOutlineShieldCheck,
    title: "Verified Listings",
    desc: "Every property is reviewed before it goes live, so what you see is what actually exists.",
  },
  {
    icon: HiOutlineCash,
    title: "Transparent Pricing",
    desc: "No hidden charges. Prices shown are what owners have listed — nothing added in between.",
  },
  {
    icon: HiOutlineChatAlt2,
    title: "Direct Owner Contact",
    desc: "Message or WhatsApp the property owner directly, with no broker in the middle.",
  },
];

const testimonials = [
  { name: "Ananya Rao", role: "Bought an apartment in Bengaluru", quote: "I shortlisted three flats and closed the deal in under two weeks — the filters made it painless." },
  { name: "Vikram Shah", role: "Rented a flat in Pune", quote: "Found a place near my office within budget. Talking to the owner directly saved a lot of back and forth." },
  { name: "Priya Menon", role: "Listed her villa for sale", quote: "Listing my property took minutes, and I could track views right from my dashboard." },
];

const faqs = [
  { q: "Is it free to list a property?", a: "Yes, creating an account and listing a property is completely free on Estately." },
  { q: "How do I contact a property owner?", a: "Open any listing and use the Contact Owner form or the WhatsApp button on the details page." },
  { q: "Can I save properties to review later?", a: "Yes — tap the heart icon on any listing to add it to your Favorites, accessible from your dashboard." },
  { q: "How do I mark my property as sold or rented?", a: "From your dashboard, open My Listings and update the status on any property you own." },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [featuredRes, latestRes] = await Promise.all([
          api.get("/properties/featured"),
          api.get("/properties?limit=6&sort=-createdAt"),
        ]);
        setFeatured(featuredRes.data);
        setLatest(latestRes.data.properties || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="container-xl relative py-24 md:py-32">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="section-eyebrow text-brass mb-5"
          >
            No. 01 — Find your next address
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-medium leading-[1.1] max-w-3xl"
          >
            Property hunting, without the noise of a hundred tabs.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-white/70 max-w-xl text-lg"
          >
            Browse verified apartments, villas, and plots — filter by what actually
            matters, and talk to owners directly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10"
          >
            <SearchBar />
          </motion.div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-xl py-16">
        <p className="section-eyebrow mb-2">No. 02 — Browse by category</p>
        <h2 className="font-display text-3xl font-medium mb-10">What are you looking for?</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {categories.map((c) => (
            <Link
              key={c.type}
              to={`/listings?propertyType=${c.type}`}
              className="group border border-stone-line bg-white rounded-sm p-6 flex flex-col items-center text-center gap-3 hover:border-brass hover:shadow-md transition-all"
            >
              <c.icon size={34} className="text-ink group-hover:text-brass transition-colors" />
              <span className="font-medium text-sm">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="container-xl py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-eyebrow mb-2">No. 03 — Handpicked</p>
            <h2 className="font-display text-3xl font-medium">Featured Properties</h2>
          </div>
          <Link to="/listings" className="hidden sm:block text-sm font-medium text-brass hover:underline">
            View all listings →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : featured.slice(0, 4).map((p, i) => <PropertyCard key={p._id} property={p} index={i} />)}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section id="why-us" className="bg-white border-y border-stone-line py-20">
        <div className="container-xl">
          <p className="section-eyebrow mb-2">No. 04 — Why Estately</p>
          <h2 className="font-display text-3xl font-medium mb-12 max-w-xl">
            Built to remove the friction from property hunting.
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {whyUs.map((w) => (
              <div key={w.title}>
                <w.icon size={30} className="text-brass mb-4" />
                <h3 className="font-display text-xl font-medium mb-2">{w.title}</h3>
                <p className="text-sm text-ink/60 leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-ink text-white py-16">
        <div className="container-xl grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <CountUp value={1200} label="Properties Listed" />
          <CountUp value={850} label="Happy Customers" />
          <CountUp value={40} label="Cities Covered" suffix="+" />
          <CountUp value={98} label="Satisfaction Rate" suffix="%" />
        </div>
      </section>

      {/* LATEST */}
      <section className="container-xl py-16">
        <p className="section-eyebrow mb-2">No. 05 — Fresh on the market</p>
        <h2 className="font-display text-3xl font-medium mb-10">Latest Properties</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : latest.map((p, i) => <PropertyCard key={p._id} property={p} index={i} />)}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="bg-white border-y border-stone-line py-20">
        <div className="container-xl">
          <p className="section-eyebrow mb-2">No. 06 — In their words</p>
          <h2 className="font-display text-3xl font-medium mb-12">What our users say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-stone-bg border border-stone-line p-7 rounded-sm">
                <p className="text-ink/80 leading-relaxed mb-6">"{t.quote}"</p>
                <p className="font-medium text-sm">{t.name}</p>
                <p className="text-xs text-ink/50">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="container-xl py-20">
        <p className="section-eyebrow mb-2">No. 07 — Good to know</p>
        <h2 className="font-display text-3xl font-medium mb-10">Frequently Asked Questions</h2>
        <div className="max-w-2xl divide-y divide-stone-line border-t border-b border-stone-line">
          {faqs.map((f, i) => (
            <div key={f.q}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                className="w-full flex items-center justify-between py-5 text-left"
              >
                <span className="font-medium">{f.q}</span>
                <HiOutlineChevronDown
                  className={`transition-transform ${openFaq === i ? "rotate-180 text-brass" : ""}`}
                />
              </button>
              {openFaq === i && <p className="pb-5 text-sm text-ink/60 leading-relaxed">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brass text-white py-20">
        <div className="container-xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-medium mb-4">
            Ready to list your property?
          </h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">
            Join hundreds of owners already reaching buyers and tenants directly on Estately.
          </p>
          <Link to="/register" className="btn-primary !bg-ink hover:!bg-ink-900">
            Get Started — It's Free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
