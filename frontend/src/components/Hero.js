import { SearchBar } from "./SearchBar";

export function Hero({ searchValue, onSearchValueChange, onSearchSubmit }) {
  return (
    <section className="hero container">
      <div className="heroGrid">
        <div className="stack">
          <div className="eyebrow">Your next good story starts here</div>
          <h1 className="heroTitle">Find a place that feels like a break.</h1>
          <p className="heroCopy">
            Browse handpicked escapes across India's beaches, mountains, cities, and wild rivers.
            Search by mood, then let the destination details do the rest.
          </p>
          <div className="heroActions">
            <a className="primaryButton" href="#explore">Explore destinations</a>
            <span className="muted">Simple planning. Better weekends.</span>
          </div>
          <div className="heroStats" aria-label="Smart Tour highlights">
            <div className="heroStat"><strong>6</strong><span>destinations</span></div>
            <div className="heroStat"><strong>4.9/5</strong><span>top guest rating</span></div>
            <div className="heroStat"><strong>24/7</strong><span>trip inspiration</span></div>
          </div>
        </div>
        <div className="stack">
          <div className="heroVisual">
            <img src="/placeholders/goa.svg" alt="Illustration of a Goa beach escape" />
            <div className="heroBadge"><strong>Today's mood</strong><br />Salt air, slow mornings, and somewhere new.</div>
          </div>
          <SearchBar value={searchValue} onChange={onSearchValueChange} onSubmit={onSearchSubmit} />
        </div>
      </div>
    </section>
  );
}
