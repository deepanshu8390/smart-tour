"use client";

import { useEffect, useState } from "react";

import { Footer } from "./Footer";
import { FilterPills } from "./FilterPills";
import { Hero } from "./Hero";
import { HotLocations } from "./HotLocations";
import { LocationGrid } from "./LocationGrid";
import { Navbar } from "./Navbar";
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
  const [allLocations, setAllLocations] = useState([]);

  const [hotLocations, setHotLocations] = useState([]);

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
      .then((response) => {
        if (!mounted) return;
        const sortedByRating = [...response.data].sort((a, b) => b.rating - a.rating);
        setAllLocations(response.data);
        setHotLocations(sortedByRating.slice(0, 3));
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [search, activeFilter]);

  useEffect(() => {
    const pageSize = 6;
    const totalPages = Math.max(1, Math.ceil(allLocations.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * pageSize;
    setLocationState({
      total: allLocations.length,
      page: safePage,
      limit: pageSize,
      totalPages,
      data: allLocations.slice(start, start + pageSize),
    });
  }, [allLocations, page]);

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
      <Footer />
    </div>
  );
}
