const filters = ["All", "Beach", "Mountains", "Adventure", "City"];

export function FilterPills({ activeFilter, onChange }) {
  return (
    <div className="pills" aria-label="Location type filters">
      {filters.map((filter) => (
        <button
          key={filter}
          className={`pill ${activeFilter === filter ? "pillActive" : ""}`}
          onClick={() => onChange(filter)}
          type="button"
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
