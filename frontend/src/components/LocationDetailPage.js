"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { createBooking, fetchLocation } from "@/services/api";
import { getAuthState } from "@/services/auth-storage";

export function LocationDetailPage({ projectId }) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState(2);
  const [bookingMessage, setBookingMessage] = useState(null);
  const [bookingError, setBookingError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchLocation(projectId)
      .then((data) => mounted && setLocation(data))
      .catch((err) => mounted && setError(err.message))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [projectId]);

  async function handleBookingSubmit(event) {
    event.preventDefault();
    setBookingError(null);
    setBookingMessage(null);
    const auth = getAuthState();

    if (!auth?.token) {
      setBookingError("Please login before booking.");
      return;
    }

    try {
      await createBooking(auth.token, {
        projectId,
        bookingDate,
        numberOfPeople,
      });
      setBookingMessage("Booking created successfully.");
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : "Booking failed");
    }
  }

  return (
    <div className="page">
      <Navbar />
      <main className="container section">
        {loading ? (
          <div className="card contentCard">Loading location details...</div>
        ) : error ? (
          <div className="error" role="alert">
            {error}
          </div>
        ) : location ? (
          <div className="stack">
            <section className="card contentCard heroPanel">
              <div className="detailLayout">
                <div className="stack">
                  <div className="muted">{location.type}</div>
                  <h1 className="heroTitle" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>
                    {location.hero.title}
                  </h1>
                  <p className="heroCopy">{location.hero.description}</p>
                  <p className="muted">
                    ⭐ {location.rating} ({location.reviewCount} reviews)
                  </p>
                </div>
                <img className="heroImage" src={location.hero.image} alt={location.name} />
              </div>
            </section>

            <section className="detailLayout">
              <div className="stack">
                <article className="card contentCard">
                  <h2>Description</h2>
                  <p className="muted">{location.description}</p>
                </article>
                <article className="card contentCard">
                  <h2>{location.whyChooseTitle}</h2>
                  <p className="muted">{location.whyChooseDescription}</p>
                </article>
                <article className="card contentCard">
                  <h2>Images</h2>
                  <div className="grid" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
                    {location.images.map((image) => (
                      <img
                        key={image.url}
                        src={image.url}
                        alt={image.alt}
                        className="heroImage"
                        style={{ maxHeight: 220 }}
                      />
                    ))}
                  </div>
                </article>
                <article className="card contentCard">
                  <h2>FAQs</h2>
                  <div className="stack">
                    {location.faqs.map((faq) => (
                      <div key={faq.question}>
                        <strong>{faq.question}</strong>
                        <p className="muted">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </article>
              </div>

              <aside className="stack">
                <article className="card bookingBox">
                  <h2>Book this location</h2>
                  <p className="muted">Backend-driven booking flow with JWT-protected requests.</p>
                  <form className="stack" onSubmit={handleBookingSubmit}>
                    <label className="field">
                      <span>Travel date</span>
                      <input
                        value={bookingDate}
                        onChange={(event) => setBookingDate(event.target.value)}
                        type="date"
                        required
                      />
                    </label>
                    <label className="field">
                      <span>Travelers</span>
                      <input
                        value={numberOfPeople}
                        onChange={(event) => setNumberOfPeople(Number(event.target.value))}
                        type="number"
                        min={1}
                        max={20}
                        required
                      />
                    </label>
                    <button className="primaryButton" type="submit">
                      Book now
                    </button>
                  </form>
                  {bookingMessage ? <div className="notice">{bookingMessage}</div> : null}
                  {bookingError ? <div className="error">{bookingError}</div> : null}
                  <Link href="/login" className="cardLink">
                    Need to login first? <span aria-hidden="true">→</span>
                  </Link>
                </article>
              </aside>
            </section>
          </div>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
