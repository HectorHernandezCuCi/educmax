import { useState, useEffect } from "react";

const Search = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (query === "") {
      onSearch("");
    }
  }, [query, onSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSearch} className="mb-4 flex gap-5">
      <input
        type="text"
        placeholder="Buscar..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="p-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded mt-2">
        Buscar
      </button>
    </form>
  );
};

export default Search;
