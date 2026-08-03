import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineSearch } from "react-icons/hi";

const SearchBar = ({ compact = false }) => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [purpose, setPurpose] = useState("");
  const [propertyType, setPropertyType] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (purpose) params.set("purpose", purpose);
    if (propertyType) params.set("propertyType", propertyType);
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`bg-white ${compact ? "p-3" : "p-4"} rounded-sm shadow-lg flex flex-col md:flex-row gap-3 w-full`}
    >
      <div className="flex-1 flex items-center gap-2 border border-stone-line px-4 rounded-sm">
        <HiOutlineSearch className="text-ink/40" />
        <input
          type="text"
          placeholder="Search by city, locality, or project name..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full py-3 outline-none text-sm bg-transparent"
        />
      </div>

      <select
        value={purpose}
        onChange={(e) => setPurpose(e.target.value)}
        className="input-field md:w-40"
      >
        <option value="">Buy / Rent</option>
        <option value="Sale">Buy</option>
        <option value="Rent">Rent</option>
      </select>

      <select
        value={propertyType}
        onChange={(e) => setPropertyType(e.target.value)}
        className="input-field md:w-44"
      >
        <option value="">Property Type</option>
        <option value="Flat">Flat</option>
        <option value="Apartment">Apartment</option>
        <option value="Villa">Villa</option>
        <option value="Bungalow">Bungalow</option>
        <option value="House">House</option>
        <option value="Commercial">Commercial</option>
        <option value="Land">Land</option>
      </select>

      <button type="submit" className="btn-gold whitespace-nowrap">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
