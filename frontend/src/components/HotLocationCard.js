import Link from "next/link";

export function HotLocationCard({ location }) {
  return (
    <article className="card hotCard">
      <img className="hotImage" src={location.imageUrl} alt={location.name} />
      <div className="hotCardBody">
        <h3 className="hotTitle">{location.name}</h3>
        <p className="ellipsis">{location.shortDescription}</p>
        <div className="rating">
          <span>⭐ {location.rating}</span>
          <span className="muted">({location.reviewCount} reviews)</span>
        </div>
        <Link className="cardLink" href={`/locations/${location.projectId}`}>
          Explore <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
