import { SearchBar } from "@/components/SearchBar";

export function Hero({ searchValue, onSearchValueChange, onSearchSubmit }) {
  return (
    <section className="hero container">
      <div className="heroGrid">
        <div className="stack">
          <h1 className="heroTitle">Explore places worth travelling to.</h1>
          <p className="heroCopy">
            Discover clean, simple destination pages powered by backend data. Search, filter, and
            open a location to see the full trip details.
          </p>
        </div>
        <SearchBar value={searchValue} onChange={onSearchValueChange} onSubmit={onSearchSubmit} />
      </div>
    </section>
  );
}
