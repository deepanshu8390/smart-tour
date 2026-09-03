"use client";

import { useEffect, useState } from "react";

import { Footer } from "./Footer";
import { FilterPills } from "./FilterPills";
import { LocationCard } from "./LocationCard";
import { Navbar } from "./Navbar";
import { fetchLocations } from "../services/api";

export function ProjectDirectoryPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    fetchLocations({
      page: 1,
      limit: 50,
      search: search || undefined,
      type: activeFilter === "All" ? undefined : activeFilter,
    })
      .then((response) => mounted && setLocations(response.data))
      .catch((err) => mounted && setError(err.message))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [search, activeFilter]);

  function handleSubmit(event) {
    event.preventDefault();
    setSearch(searchInput.trim());
  }

  return (
    <div className="page">
      <Navbar />
      <main>
        <section className="directoryIntro container">
          <div className="eyebrow">The destination directory</div>
          <h1>Choose the kind of trip you want to remember.</h1>
          <p className="heroCopy">Browse every Smart Tour destination in one calm, comparable view.</p>
          <form className="directorySearch" onSubmit={handleSubmit}>
            <input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} type="search" placeholder="Search by destination or mood" aria-label="Search destinations" />
            <button className="primaryButton" type="submit">Search</button>
          </form>
        </section>

        <section className="section container" aria-labelledby="directory-title">
          <div className="directoryToolbar">
            <div>
              <div className="eyebrow">Explore all</div>
              <h2 id="directory-title">Destinations worth the detour</h2>
            </div>
            <span className="resultCount" aria-live="polite">{locations.length} results</span>
          </div>
          <div className="toolbar directoryFilters">
            <FilterPills activeFilter={activeFilter} onChange={setActiveFilter} />
          </div>
          {loading ? <div className="directoryState card" role="status">Loading destinations...</div> : null}
          {error ? <div className="error" role="alert">{error}</div> : null}
          {!loading && !error && !locations.length ? <div className="notice" role="status">No destinations match your search.</div> : null}
          {!loading && !error && locations.length ? (
            <div className="grid directoryGrid">
              {locations.map((location) => <LocationCard key={location.projectId} location={location} />)}
            </div>
          ) : null}
        </section>
      </main>
      <Footer />
    </div>
  );
}
