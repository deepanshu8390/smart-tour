import { LocationCard } from "@/components/LocationCard";

export function LocationGrid({ locations, loading, error, page, totalPages, onPrevPage, onNextPage }) {
  return (
    <section id="explore" className="section container">
      <div className="sectionHeading">
        <div>
          <h2>Popular Destinations</h2>
          <p>Simple destination cards fed directly from the backend.</p>
        </div>
        <div className="pager" aria-label="Pagination controls">
          <button onClick={onPrevPage} disabled={page <= 1 || loading} type="button">
            Previous
          </button>
          <span className="muted">
            Page {page} / {totalPages}
          </span>
          <button onClick={onNextPage} disabled={page >= totalPages || loading} type="button">
            Next
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid" aria-busy="true" aria-label="Loading destinations">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="card">
              <div className="skeleton" style={{ aspectRatio: "16 / 10" }} />
              <div className="contentCard">
                <div className="skeleton" style={{ height: 16, width: "40%", borderRadius: 999 }} />
                <div style={{ height: 12 }} />
                <div className="skeleton" style={{ height: 18, width: "70%", borderRadius: 999 }} />
                <div style={{ height: 12 }} />
                <div className="skeleton" style={{ height: 12, width: "100%", borderRadius: 999 }} />
                <div style={{ height: 8 }} />
                <div className="skeleton" style={{ height: 12, width: "88%", borderRadius: 999 }} />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="error" role="alert">
          {error}
        </div>
      ) : locations.length === 0 ? (
        <div className="notice" role="status">
          No destinations found for the current search or filter.
        </div>
      ) : (
        <div className="grid">
          {locations.map((location) => (
            <LocationCard key={location.projectId} location={location} />
          ))}
        </div>
      )}
    </section>
  );
}
