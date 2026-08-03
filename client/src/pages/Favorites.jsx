import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import PropertyCard from "../components/PropertyCard";
import SkeletonCard from "../components/SkeletonCard";
import toast from "react-hot-toast";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get("/favorites")
      .then(({ data }) => setFavorites(data))
      .catch(() => toast.error("Failed to load favorites"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async (propertyId) => {
    try {
      await api.delete(`/favorites/${propertyId}`);
      setFavorites(favorites.filter((p) => p._id !== propertyId));
      toast.success("Removed from favorites");
    } catch {
      toast.error("Failed to remove");
    }
  };

  return (
    <div>
      <h2 className="font-display text-xl font-medium mb-6">My Favorite Properties</h2>

      {loading ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed border-stone-line rounded-sm">
          <p className="font-display text-xl mb-2">No favorites yet</p>
          <p className="text-sm text-ink/60 mb-6">Save properties you like to find them here later.</p>
          <Link to="/listings" className="btn-outline">Browse Listings</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {favorites.map((p, i) => (
            <PropertyCard key={p._id} property={p} index={i} isFavorite onToggleFavorite={remove} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
