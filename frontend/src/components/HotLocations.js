"use client";

import { useEffect, useRef } from "react";

import { HotLocationCard } from "@/components/HotLocationCard";

export function HotLocations({ locations, loading, error, hasMore, onLoadMore }) {
  const rowRef = useRef(null);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const handleScroll = () => {
      if (!hasMore || loading) return;
      const threshold = row.scrollWidth - row.clientWidth - 180;
      if (row.scrollLeft >= threshold) {
        onLoadMore();
      }
    };

    row.addEventListener("scroll", handleScroll, { passive: true });
    return () => row.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading, onLoadMore]);

  return (
    <section className="section container">
      <div className="sectionHeading">
        <div>
          <h2>Hot Locations</h2>
          <p>Horizontal, minimal cards that keep loading as you scroll.</p>
        </div>
      </div>

      {error ? (
        <div className="error" role="alert">
          {error}
        </div>
      ) : (
        <div ref={rowRef} className="scrollRow" aria-busy={loading ? "true" : "false"}>
          {locations.map((location) => (
            <HotLocationCard key={location.projectId} location={location} />
          ))}
          {loading ? (
            <div className="card contentCard" style={{ minWidth: 240 }}>
              Loading more...
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
