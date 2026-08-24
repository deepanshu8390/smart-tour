export function SearchBar({ value, onChange, onSubmit }) {
  return (
    <form
      className="searchBar"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type="search"
        placeholder="Search destinations..."
        aria-label="Search destinations"
      />
      <button className="primaryButton" type="submit">
        Search
      </button>
    </form>
  );
}
