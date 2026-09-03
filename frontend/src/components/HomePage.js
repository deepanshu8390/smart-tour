"use client";

import { useEffect, useState } from "react";

import { Footer } from "./Footer";
import { FilterPills } from "./FilterPills";
import { Hero } from "./Hero";
import { HotLocations } from "./HotLocations";
import { LocationGrid } from "./LocationGrid";
import { Navbar } from "./Navbar";
import { AdminTaskDashboard } from "./AdminTaskDashboard";
import { fetchLocations } from "../services/api";

export function HomePage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [locationState, setLocationState] = useState({
    total: 0,
    page: 1,
    limit: 6,
    totalPages: 1,
    data: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hotLocations, setHotLocations] = useState([]);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    const debounce = setTimeout(() => {
      setLoading(true);
      setError(null);
      const filtered = Boolean(search || activeFilter !== "All");
      fetchLocations({
      page,
      limit: filtered ? 4 : 6,
      search: search || undefined,
      type: activeFilter === "All" ? undefined : activeFilter,
      }, controller.signal)
      .then((response) => {
        if (!mounted || controller.signal.aborted) return;
        const sortedByRating = [...response.data].sort((a, b) => b.rating - a.rating);
        setLocationState(response);
        setHotLocations(sortedByRating.slice(0, 3));
      })
      .catch((err) => {
        if (!mounted || err.name === "AbortError") return;
        setError(err.message);
      })
      .finally(() => {
        if (mounted && !controller.signal.aborted) setLoading(false);
      });
    }, 250);

    return () => {
      mounted = false;
      clearTimeout(debounce);
      controller.abort();
    };
  }, [search, activeFilter, page]);

  function handleSearchSubmit() {
    setPage(1);
    setSearch(searchInput.trim());
  }

  function handleFilterChange(value) {
    setPage(1);
    setActiveFilter(value);
  }

  function handlePrevPage() {
    setPage((current) => Math.max(1, current - 1));
  }

  function handleNextPage() {
    setPage((current) => Math.min(locationState.totalPages, current + 1));
  }

  return (
    <div className="page">
      <Navbar />
      <Hero
        searchValue={searchInput}
        onSearchValueChange={setSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />
      <section className="section container">
        <FilterPills activeFilter={activeFilter} onChange={handleFilterChange} />
      </section>
      <LocationGrid
        locations={locationState.data}
        loading={loading}
        error={error}
        page={locationState.page}
        totalPages={locationState.totalPages}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
      />
      <HotLocations
        locations={hotLocations}
        loading={loading}
        error={error}
        hasMore={false}
        onLoadMore={() => {}}
      />
      <AdminTaskDashboard />
      <Footer />
    </div>
  );
}
