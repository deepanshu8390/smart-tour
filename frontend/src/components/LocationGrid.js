import { LocationCard } from "./LocationCard";

export function LocationGrid({ locations, loading, error, page, totalPages, onPrevPage, onNextPage }) {
  return (
    <section id="explore" className="section container">
      <div className="sectionHeading">
        <div>
          <div className="eyebrow">Start exploring</div>
          <h2>Where will you go next?</h2>
          <p>Compare a few good options, then open the one that feels right.</p>
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

      <div className="toolbar">
        <div className="resultCount" aria-live="polite">
          {locations.length ? <><strong>{locations.length}</strong> destinations on this page</> : "No matching destinations"}
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
        <div className="featuredGrid">
          {locations.map((location, index) => (
            <LocationCard key={location.projectId} location={location} featured={index === 0} />
          ))}
        </div>
      )}
    </section>
  );
}
