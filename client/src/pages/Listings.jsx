import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import PropertyCard from "../components/PropertyCard";
import SkeletonCard from "../components/SkeletonCard";
import toast from "react-hot-toast";

const emptyFilters = {
  keyword: "",
  city: "",
  state: "",
  propertyType: "",
  purpose: "",
  minPrice: "",
  maxPrice: "",
  bedrooms: "",
  bathrooms: "",
  furnished: "",
  parking: "",
};

const Listings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const [filters, setFilters] = useState({ ...emptyFilters, ...Object.fromEntries(searchParams) });
  const [properties, setProperties] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters, page };
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);
      const { data } = await api.get("/properties", { params });
      setProperties(data.properties);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  useEffect(() => {
    if (!user) return setFavorites([]);
    api.get("/favorites").then(({ data }) => setFavorites(data.map((p) => p._id))).catch(() => {});
  }, [user]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = (e) => {
    e.preventDefault();
    setPage(1);
    setSearchParams(Object.fromEntries(Object.entries(filters).filter(([, v]) => v)));
    fetchProperties();
  };

  const resetFilters = () => {
    setFilters(emptyFilters);
    setSearchParams({});
    setPage(1);
  };

  const toggleFavorite = async (propertyId) => {
    if (!user) return toast.error("Please login to save favorites");
    try {
      if (favorites.includes(propertyId)) {
        await api.delete(`/favorites/${propertyId}`);
        setFavorites(favorites.filter((id) => id !== propertyId));
        toast.success("Removed from favorites");
      } else {
        await api.post(`/favorites/${propertyId}`);
        setFavorites([...favorites, propertyId]);
        toast.success("Added to favorites");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="container-xl py-12">
      <div className="mb-8">
        <p className="section-eyebrow mb-2">Browse</p>
        <h1 className="font-display text-3xl md:text-4xl font-medium">All Properties</h1>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        {/* FILTER SIDEBAR */}
        <aside className={`${showFilters ? "block" : "hidden"} lg:block`}>
          <form onSubmit={applyFilters} className="bg-white border border-stone-line rounded-sm p-6 space-y-5 sticky top-24">
            <div>
              <label className="text-xs font-mono uppercase tracking-wide text-ink/50">Keyword</label>
              <input name="keyword" value={filters.keyword} onChange={handleFilterChange} className="input-field mt-1" placeholder="e.g. villa, MG Road" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono uppercase tracking-wide text-ink/50">City</label>
                <input name="city" value={filters.city} onChange={handleFilterChange} className="input-field mt-1" />
              </div>
              <div>
                <label className="text-xs font-mono uppercase tracking-wide text-ink/50">State</label>
                <input name="state" value={filters.state} onChange={handleFilterChange} className="input-field mt-1" />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wide text-ink/50">Purpose</label>
              <select name="purpose" value={filters.purpose} onChange={handleFilterChange} className="input-field mt-1">
                <option value="">Any</option>
                <option value="Sale">Buy</option>
                <option value="Rent">Rent</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wide text-ink/50">Property Type</label>
              <select name="propertyType" value={filters.propertyType} onChange={handleFilterChange} className="input-field mt-1">
                <option value="">Any</option>
                {["Flat", "Apartment", "Villa", "Bungalow", "House", "Commercial", "Land"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono uppercase tracking-wide text-ink/50">Min Price</label>
                <input type="number" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} className="input-field mt-1" />
              </div>
              <div>
                <label className="text-xs font-mono uppercase tracking-wide text-ink/50">Max Price</label>
                <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} className="input-field mt-1" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono uppercase tracking-wide text-ink/50">Bedrooms</label>
                <select name="bedrooms" value={filters.bedrooms} onChange={handleFilterChange} className="input-field mt-1">
                  <option value="">Any</option>
                  {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-mono uppercase tracking-wide text-ink/50">Bathrooms</label>
                <select name="bathrooms" value={filters.bathrooms} onChange={handleFilterChange} className="input-field mt-1">
                  <option value="">Any</option>
                  {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}+</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wide text-ink/50">Furnished</label>
              <select name="furnished" value={filters.furnished} onChange={handleFilterChange} className="input-field mt-1">
                <option value="">Any</option>
                <option value="Furnished">Furnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.parking === "true"}
                onChange={(e) => setFilters({ ...filters, parking: e.target.checked ? "true" : "" })}
              />
              Parking Available
            </label>

            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-primary flex-1 !py-2.5 text-sm">Apply</button>
              <button type="button" onClick={resetFilters} className="btn-outline flex-1 !py-2.5 text-sm">Reset</button>
            </div>
          </form>
        </aside>

        {/* RESULTS */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-ink/60">{loading ? "Searching..." : `${properties.length} results on this page`}</p>
            <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden btn-outline !py-2 !px-4 text-xs">
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-stone-line rounded-sm">
              <p className="font-display text-xl mb-2">No properties match your filters</p>
              <p className="text-sm text-ink/60 mb-6">Try widening your price range or clearing a filter.</p>
              <button onClick={resetFilters} className="btn-outline">Reset Filters</button>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((p, i) => (
                  <PropertyCard
                    key={p._id}
                    property={p}
                    index={i}
                    isFavorite={favorites.includes(p._id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-9 h-9 text-sm rounded-sm border ${
                        page === i + 1 ? "bg-ink text-white border-ink" : "border-stone-line hover:border-ink"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listings;
