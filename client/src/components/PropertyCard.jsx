import { Link } from "react-router-dom";
import { HiOutlineHeart, HiHeart, HiOutlineLocationMarker } from "react-icons/hi";
import { PiBed, PiBathtub, PiRulerLight } from "react-icons/pi";

const formatPrice = (price, purpose) => {
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
  return purpose === "Rent" ? `${formatted}/mo` : formatted;
};

const PropertyCard = ({ property, isFavorite, onToggleFavorite, index = 0 }) => {
  const img = property.images?.[0]
    ? property.images[0].startsWith("http")
      ? property.images[0]
      : `${import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000"}${property.images[0]}`
    : `https://source.unsplash.com/600x450/?house,property&sig=${index}`;

  return (
    <div className="group bg-stone-card border border-stone-line rounded-sm overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative overflow-hidden">
        <Link to={`/property/${property._id}`}>
          <img
            src={img}
            alt={property.title}
            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>
        <span className="absolute top-3 left-3 bg-ink text-white text-[11px] font-mono tracking-widest uppercase px-2.5 py-1">
          For {property.purpose}
        </span>
        {onToggleFavorite && (
          <button
            onClick={() => onToggleFavorite(property._id)}
            className="absolute top-3 right-3 bg-white/90 rounded-full p-2 hover:bg-white transition-colors"
            aria-label="Toggle favorite"
          >
            {isFavorite ? <HiHeart className="text-brass" size={18} /> : <HiOutlineHeart className="text-ink" size={18} />}
          </button>
        )}
      </div>

      <div className="p-5">
        <p className="font-mono text-lg font-bold text-ink">{formatPrice(property.price, property.purpose)}</p>
        <Link to={`/property/${property._id}`}>
          <h3 className="font-display text-lg font-medium mt-1 mb-1 truncate hover:text-brass transition-colors">
            {property.title}
          </h3>
        </Link>
        <p className="flex items-center gap-1 text-sm text-ink/60 mb-4">
          <HiOutlineLocationMarker />
          {property.city}, {property.state}
        </p>

        <div className="flex items-center justify-between text-sm text-ink/70 border-t border-stone-line pt-4">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1"><PiBed /> {property.bedrooms}</span>
          )}
          {property.bathrooms > 0 && (
            <span className="flex items-center gap-1"><PiBathtub /> {property.bathrooms}</span>
          )}
          <span className="flex items-center gap-1"><PiRulerLight /> {property.area} sqft</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
