import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDebounce from "./hooks/useDebounce";
import Loader from "./utils";

export default function ElixirsPage() {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [elixirs, setElixirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    name: "",
    difficulty: "",
    ingredient: "",
    inventorFullName: "",
    manufacturer: "",
  });

  const debouncedName = useDebounce(filters.name, 500);
  const debouncedDifficulty = useDebounce(filters.difficulty, 500);
  const debouncedIngredient = useDebounce(filters.ingredient, 500);
  const debouncedInventor = useDebounce(filters.inventorFullName, 500);
  const debouncedManufacturer = useDebounce(filters.manufacturer, 500);

  const debouncedFilters = useMemo(
    () => ({
      Name: debouncedName,
      Difficulty: debouncedDifficulty,
      Ingredient: debouncedIngredient,
      InventorFullName: debouncedInventor,
      Manufacturer: debouncedManufacturer,
    }),
    [
      debouncedName,
      debouncedDifficulty,
      debouncedIngredient,
      debouncedInventor,
      debouncedManufacturer,
    ]
  );


  // Fetch elixirs data with filter parameters
  const fetchElixirs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();

      Object.entries(debouncedFilters).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        }
      });

      const queryString = params.toString();
      const url = `${apiUrl}/Elixirs${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch elixirs");
      }

      const data = await response.json();
      setElixirs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [debouncedFilters]);

  // Update URL and fetch data when debounced filters change
  useEffect(() => {
    fetchElixirs();
  }, [fetchElixirs]);

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      name: "",
      difficulty: "",
      ingredient: "",
      inventorFullName: "",
      manufacturer: "",
    });
    navigate("/", { scroll: false });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 text-amber-400">
            Harry Potter Wizard
          </h1>
          <p className="text-xl text-slate-300">
            Discover magical elixirs from the wizarding world
          </p>
        </header>

        {/* Filters Section */}
        <div className="bg-slate-800 rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-amber-400">
            Filter Elixirs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-1 text-slate-300"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={filters.name}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Filter by name..."
              />
            </div>
            <div>
              <label
                htmlFor="difficulty"
                className="block text-sm font-medium mb-1 text-slate-300"
              >
                Difficulty
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={filters.difficulty}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="">Select Difficulty</option>
                <option value="Unknown">Unknown</option>
                <option value="Advanced">Advanced</option>
                <option value="Moderate">Moderate</option>
                <option value="Beginner">Beginner</option>
                <option value="OrdinaryWizardingLevel">
                  OrdinaryWizardingLevel
                </option>
                <option value="OneOfAKind">OneOfAKind</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="ingredient"
                className="block text-sm font-medium mb-1 text-slate-300"
              >
                Ingredient
              </label>
              <input
                type="text"
                id="ingredient"
                name="ingredient"
                value={filters.ingredient}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Filter by ingredient..."
              />
            </div>
            <div>
              <label
                htmlFor="inventorFullName"
                className="block text-sm font-medium mb-1 text-slate-300"
              >
                Inventor Full Name
              </label>
              <input
                type="text"
                id="inventorFullName"
                name="inventorFullName"
                value={filters.inventorFullName}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Filter by inventor..."
              />
            </div>
            <div>
              <label
                htmlFor="manufacturer"
                className="block text-sm font-medium mb-1 text-slate-300"
              >
                Manufacturer
              </label>
              <input
                type="text"
                id="manufacturer"
                name="manufacturer"
                value={filters.manufacturer}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Filter by manufacturer..."
              />
            </div>
          </div>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-md transition-colors"
          >
            Reset Filters
          </button>
        </div>

        {/* Elixirs List */}
        <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-amber-400">
            Elixirs {elixirs.length > 0 && `(${elixirs.length})`}
          </h2>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader />
              <span className="ml-2 text-lg">Loading elixirs...</span>
            </div>
          ) : error ? (
            <div className="bg-red-900/30 border border-red-700 text-red-200 p-4 rounded-md">
              <p className="text-lg font-medium">Error loading elixirs</p>
              <p>{error}</p>
            </div>
          ) : elixirs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg text-slate-400">
                No elixirs found matching your filters.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-md transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {elixirs.map((elixir) => (
                <div
                  key={elixir.id}
                  className="bg-slate-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2 text-amber-400">
                      {elixir.name}
                    </h3>

                    {elixir.effect && (
                      <p className="text-slate-300 mb-3">{elixir.effect}</p>
                    )}

                    {elixir.difficulty && (
                      <div className="mb-2">
                        <span className="text-sm font-medium text-slate-400">
                          Difficulty:{" "}
                        </span>
                        <span className="text-slate-300">
                          {elixir.difficulty}
                        </span>
                      </div>
                    )}

                    {elixir.inventor && elixir.inventor.fullName && (
                      <div className="mb-2">
                        <span className="text-sm font-medium text-slate-400">
                          Inventor:{" "}
                        </span>
                        <span className="text-slate-300">
                          {elixir.inventor.fullName}
                        </span>
                      </div>
                    )}

                    {elixir.manufacturer && (
                      <div className="mb-2">
                        <span className="text-sm font-medium text-slate-400">
                          Manufacturer:{" "}
                        </span>
                        <span className="text-slate-300">
                          {elixir.manufacturer}
                        </span>
                      </div>
                    )}

                    {elixir.ingredients && elixir.ingredients.length > 0 && (
                      <div className="mt-3">
                        <span className="text-sm font-medium text-slate-400">
                          Ingredients:
                        </span>
                        <ul className="mt-1 list-disc list-inside text-slate-300">
                          {elixir.ingredients.map((ingredient, index) => (
                            <li key={index} className="text-sm">
                              {ingredient.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
