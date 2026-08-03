import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import PropertyCard from "../components/PropertyCard";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import {
  HiOutlineLocationMarker,
  HiOutlineShare,
  HiHeart,
  HiOutlineHeart,
} from "react-icons/hi";
import { PiBed, PiBathtub, PiRulerLight, PiCar } from "react-icons/pi";

const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "");

const formatPrice = (price, purpose) => {
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
  return purpose === "Rent" ? `${formatted}/mo` : formatted;
};

const resolveImg = (src, sig = 0) =>
  src
    ? src.startsWith("http")
      ? src
      : `${API_ORIGIN}${src}`
    : `https://source.unsplash.com/1200x800/?house,interior&sig=${sig}`;

const PropertyDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [property, setProperty] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [inquiry, setInquiry] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    api
      .get(`/properties/${id}`)
      .then(({ data }) => {
        setProperty(data.property);
        setSimilar(data.similarProperties || []);
      })
      .catch(() => toast.error("Property not found"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!user) return setIsFavorite(false);
    api
      .get("/favorites")
      .then(({ data }) => setIsFavorite(data.some((p) => p._id === id)))
      .catch(() => {});
  }, [user, id]);

  useEffect(() => {
    if (user) {
      setInquiry((prev) => ({ ...prev, name: user.name, email: user.email, phone: user.phone || "" }));
    }
  }, [user]);

  const toggleFavorite = async () => {
    if (!user) return toast.error("Please login to save favorites");
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${id}`);
        toast.success("Removed from favorites");
      } else {
        await api.post(`/favorites/${id}`);
        toast.success("Added to favorites");
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Could not copy link");
    }
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post(`/inquiries/${id}`, inquiry);
      toast.success("Message sent to the owner");
      setInquiry((prev) => ({ ...prev, message: "" }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <Loader />;
  if (!property) {
    return (
      <div className="container-xl py-24 text-center">
        <p className="font-display text-2xl mb-4">Property not found</p>
        <Link to="/listings" className="btn-outline">Back to Listings</Link>
      </div>
    );
  }

  const images = property.images?.length ? property.images : [null, null, null];
  const whatsappNumber = (property.ownerContact?.phone || "").replace(/\D/g, "");
  const whatsappMsg = encodeURIComponent(`Hi, I'm interested in "${property.title}" listed on Estately.`);

  return (
    <div className="container-xl py-10 md:py-14">
      {/* Breadcrumb */}
      <div className="text-xs text-ink/50 mb-6 flex items-center gap-2 font-mono uppercase tracking-wide">
        <Link to="/" className="hover:text-brass">Home</Link> /
        <Link to="/listings" className="hover:text-brass">Listings</Link> /
        <span className="text-ink">{property.city}</span>
      </div>

      {/* GALLERY */}
      <div className="grid md:grid-cols-[1fr_140px] gap-3 mb-10">
        <div className="rounded-sm overflow-hidden h-[320px] md:h-[460px] bg-stone-line">
          <img
            src={resolveImg(images[activeImg], activeImg)}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible">
          {images.slice(0, 4).map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              className={`shrink-0 w-24 h-24 md:w-full md:h-[100px] rounded-sm overflow-hidden border-2 ${
                activeImg === i ? "border-brass" : "border-transparent"
              }`}
            >
              <img src={resolveImg(img, i + 10)} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-12">
        {/* MAIN INFO */}
        <div>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <span className="inline-block bg-ink text-white text-[11px] font-mono tracking-widest uppercase px-2.5 py-1 mb-3">
                For {property.purpose}
              </span>
              <h1 className="font-display text-3xl md:text-4xl font-medium mb-2">{property.title}</h1>
              <p className="flex items-center gap-1.5 text-ink/60">
                <HiOutlineLocationMarker />
                {property.address}, {property.city}, {property.state} {property.pincode}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={toggleFavorite} className="w-11 h-11 flex items-center justify-center border border-stone-line rounded-full hover:border-brass transition-colors" aria-label="Toggle favorite">
                {isFavorite ? <HiHeart className="text-brass" size={20} /> : <HiOutlineHeart size={20} />}
              </button>
              <button onClick={handleShare} className="w-11 h-11 flex items-center justify-center border border-stone-line rounded-full hover:border-brass transition-colors" aria-label="Share">
                <HiOutlineShare size={18} />
              </button>
            </div>
          </div>

          <p className="font-mono text-3xl font-bold text-ink mb-8">
            {formatPrice(property.price, property.purpose)}
          </p>

          {/* Specs grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 border-y border-stone-line py-6">
            <div className="text-center">
              <PiBed className="mx-auto mb-1 text-brass" size={22} />
              <p className="text-sm font-medium">{property.bedrooms} Beds</p>
            </div>
            <div className="text-center">
              <PiBathtub className="mx-auto mb-1 text-brass" size={22} />
              <p className="text-sm font-medium">{property.bathrooms} Baths</p>
            </div>
            <div className="text-center">
              <PiRulerLight className="mx-auto mb-1 text-brass" size={22} />
              <p className="text-sm font-medium">{property.area} sqft</p>
            </div>
            <div className="text-center">
              <PiCar className="mx-auto mb-1 text-brass" size={22} />
              <p className="text-sm font-medium">{property.parking ? "Parking" : "No Parking"}</p>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="font-display text-xl font-medium mb-3">Description</h2>
            <p className="text-ink/70 leading-relaxed whitespace-pre-line">{property.description}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            <div>
              <h3 className="font-display text-lg font-medium mb-3">Specifications</h3>
              <ul className="text-sm text-ink/70 space-y-2">
                <li className="flex justify-between border-b border-stone-line pb-2"><span>Property Type</span><span className="font-medium text-ink">{property.propertyType}</span></li>
                <li className="flex justify-between border-b border-stone-line pb-2"><span>Furnished</span><span className="font-medium text-ink">{property.furnished}</span></li>
                <li className="flex justify-between border-b border-stone-line pb-2"><span>Status</span><span className="font-medium text-ink">{property.status}</span></li>
                <li className="flex justify-between border-b border-stone-line pb-2"><span>Listed On</span><span className="font-medium text-ink">{new Date(property.createdAt).toLocaleDateString()}</span></li>
              </ul>
            </div>
            {property.amenities?.length > 0 && (
              <div>
                <h3 className="font-display text-lg font-medium mb-3">Amenities</h3>
                <ul className="grid grid-cols-2 gap-2 text-sm text-ink/70">
                  {property.amenities.map((a) => (
                    <li key={a} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brass" /> {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mb-4">
            <h3 className="font-display text-lg font-medium mb-3">Location</h3>
            <div className="h-56 bg-stone-line rounded-sm flex items-center justify-center text-ink/40 text-sm">
              Map preview placeholder — {property.city}, {property.state}
            </div>
          </div>
        </div>

        {/* SIDEBAR: Contact + Inquiry */}
        <aside className="space-y-6">
          <div className="bg-white border border-stone-line rounded-sm p-6 sticky top-24">
            <h3 className="font-display text-lg font-medium mb-1">Contact Owner</h3>
            <p className="text-sm text-ink/60 mb-4">{property.ownerContact?.name}</p>

            {whatsappNumber && (
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full !bg-[#25D366] hover:!bg-[#1DA851] mb-3"
              >
                WhatsApp Owner
              </a>
            )}
            <a href={`tel:${property.ownerContact?.phone}`} className="btn-outline w-full mb-6">
              Call {property.ownerContact?.phone || "Owner"}
            </a>

            <form onSubmit={handleInquirySubmit} className="space-y-3">
              <input
                required
                placeholder="Your Name"
                value={inquiry.name}
                onChange={(e) => setInquiry({ ...inquiry, name: e.target.value })}
                className="input-field"
              />
              <input
                type="email"
                required
                placeholder="Your Email"
                value={inquiry.email}
                onChange={(e) => setInquiry({ ...inquiry, email: e.target.value })}
                className="input-field"
              />
              <input
                placeholder="Your Phone"
                value={inquiry.phone}
                onChange={(e) => setInquiry({ ...inquiry, phone: e.target.value })}
                className="input-field"
              />
              <textarea
                required
                rows={4}
                placeholder={`I'm interested in "${property.title}"...`}
                value={inquiry.message}
                onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })}
                className="input-field resize-none"
              />
              <button type="submit" disabled={sending} className="btn-gold w-full disabled:opacity-60">
                {sending ? "Sending..." : "Send Inquiry"}
              </button>
            </form>
          </div>
        </aside>
      </div>

      {/* SIMILAR PROPERTIES */}
      {similar.length > 0 && (
        <div className="mt-20">
          <p className="section-eyebrow mb-2">You might also like</p>
          <h2 className="font-display text-2xl md:text-3xl font-medium mb-8">Similar Properties</h2>
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {similar.map((p, i) => (
              <PropertyCard key={p._id} property={p} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
