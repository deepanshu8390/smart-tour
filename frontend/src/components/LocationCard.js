import Link from "next/link";

export function LocationCard({ location }) {
  return (
    <article className="card locationCard">
      <img className="locationCardImage" src={location.imageUrl} alt={location.name} />
      <div className="locationCardBody">
        <div className="locationCardMeta">
          <span>{location.type}</span>
          <span>Rating {location.rating} ({location.reviewCount})</span>
        </div>
        <h3 className="locationCardTitle">{location.name}</h3>
        <p className="locationCardText">{location.shortDescription}</p>
        <Link className="cardLink" href={`/locations/${location.projectId}`}>
          Explore <span aria-hidden="true">-&gt;</span>
        </Link>
      </div>
    </article>
  );
}
