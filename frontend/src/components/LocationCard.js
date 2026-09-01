import Link from "next/link";

export function LocationCard({ location, featured = false }) {
  return (
    <article className={`card locationCard ${featured ? "featuredCard" : ""}`}>
      <img className="locationCardImage" src={location.imageUrl} alt={location.name} />
      <div className="locationCardBody">
        <div className="locationCardMeta">
          <span>{location.type}</span>
          <span aria-label={`${location.rating} out of 5 rating`}>★ {location.rating}</span>
        </div>
        <h3 className="locationCardTitle">{location.name}</h3>
        <p className="locationCardText">{location.shortDescription}</p>
        <Link className="cardLink" href={`/locations/${location.projectId}`}>
          View destination <span aria-hidden="true">-&gt;</span>
        </Link>
      </div>
    </article>
  );
}
