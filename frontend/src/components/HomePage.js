"use client";

import { useEffect, useState } from "react";

import { Footer } from "@/components/Footer";
import { FilterPills } from "@/components/FilterPills";
import { Hero } from "@/components/Hero";
import { HotLocations } from "@/components/HotLocations";
import { LocationGrid } from "@/components/LocationGrid";
import { Navbar } from "@/components/Navbar";
import { fetchLocations } from "@/services/api";

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
  const [hotPage, setHotPage] = useState(1);
  const [hotLoading, setHotLoading] = useState(true);
  const [hotError, setHotError] = useState(null);
  const [hotHasMore, setHotHasMore] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    fetchLocations({
      page,
      limit: 6,
      search: search || undefined,
      type: activeFilter === "All" ? undefined : activeFilter,
    })
      .then((response) => {
        if (!mounted) return;
        setLocationState(response);
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
  }, [page, search, activeFilter]);

  useEffect(() => {
    let mounted = true;
    setHotLoading(true);
    setHotError(null);

    fetchLocations({
      page: hotPage,
      limit: 4,
      sort: "rating_desc",
    })
      .then((response) => {
        if (!mounted) return;
        setHotLocations((current) => (hotPage === 1 ? response.data : [...current, ...response.data]));
        setHotHasMore(hotPage < response.totalPages);
      })
      .catch((err) => {
        if (!mounted) return;
        setHotError(err.message);
      })
      .finally(() => {
        if (mounted) setHotLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [hotPage]);

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

  function loadMoreHotLocations() {
    if (hotLoading || !hotHasMore) return;
    setHotPage((current) => current + 1);
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
        loading={hotLoading}
        error={hotError}
        hasMore={hotHasMore}
        onLoadMore={loadMoreHotLocations}
      />
      <Footer />
    </div>
  );
}
