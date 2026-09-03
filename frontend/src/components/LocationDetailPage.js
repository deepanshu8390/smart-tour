"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Footer } from "./Footer";
import { LocationCard } from "./LocationCard";
import { Navbar } from "./Navbar";
import { createBooking, fetchLocation } from "../services/api";
import { getAuthState } from "../services/auth-storage";

export function LocationDetailPage({ projectId }) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState(2);
  const [bookingMessage, setBookingMessage] = useState(null);
  const [bookingError, setBookingError] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState(null);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setLocation(null);
    fetchLocation(projectId, controller.signal)
      .then((data) => mounted && setLocation(data))
      .catch((err) => mounted && setError(err.message))
      .finally(() => mounted && !controller.signal.aborted && setLoading(false));
    return () => {
      mounted = false;
      controller.abort();
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
    if (!bookingDate) {
      setBookingError("Please choose a travel date.");
      return;
    }

    const key = crypto.randomUUID();
    setIdempotencyKey(key);
    setShowConfirmation(true);
  }

  async function confirmBooking() {
    const auth = getAuthState();
    if (!auth?.token || !idempotencyKey) return;
    setShowConfirmation(false);
    setBookingLoading(true);
    try {
      await createBooking(auth.token, { projectId, bookingDate, numberOfPeople }, idempotencyKey);
      setBookingMessage("Booking created successfully.");
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  }

  return (
    <div className="page">
      <Navbar />
      <main className="container section">
        {loading ? (
          <div className="card contentCard" role="status">Loading location details...</div>
        ) : error ? (
          <div className="error" role="alert">{error}</div>
        ) : location ? (
          <div className="stack">
            <section className="card contentCard heroPanel">
              <div className="detailLayout">
                <div className="detailHeroCopy">
                  <div className="eyebrow">Destination guide</div>
                  <h1 className="heroTitle">{location.hero.title}</h1>
                  <p className="muted">{location.location} / {location.type}</p>
                  <p className="heroCopy">{location.hero.description}</p>
                  <div className="facts" aria-label={`${location.name} facts`}>
                    <div className="fact"><strong>* {location.rating}</strong><span>{location.reviewCount} reviews</span></div>
                    <div className="fact"><strong>{location.type}</strong><span>trip style</span></div>
                    <div className="fact"><strong>{location.location}</strong><span>destination</span></div>
                  </div>
                </div>
                <div><img className="detailHeroImage" src={location.hero.image} alt={location.name} /></div>
              </div>
            </section>
            <a className="mobileBookingCta" href="#booking">Book {location.name}</a>

            <section className="detailLayout">
              <div className="stack">
                <article className="card contentCard">
                  <div className="eyebrow">The short version</div>
                  <h2>Why {location.name}?</h2>
                  <p className="muted">{location.description}</p>
                  <p className="muted">{location.whyChooseDescription}</p>
                </article>
                <article className="card contentCard">
                  <div className="sectionHeading">
                    <div><div className="eyebrow">Get a feel for it</div><h2>Destination moments</h2></div>
                  </div>
                  <div className="galleryGrid">
                    {location.images.map((image) => <img key={image.url} src={image.url} alt={image.alt} />)}
                  </div>
                </article>
                <article className="card contentCard">
                  <div className="sectionHeading">
                    <div><div className="eyebrow">Before you go</div><h2>Good to know</h2></div>
                  </div>
                  <div className="faqList">
                    {location.faqs.map((faq) => (
                      <details className="faqItem" key={faq.question}>
                        <summary>{faq.question}</summary>
                        <p className="faqAnswer">{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                </article>
              </div>

              <aside className="stack">
                <article className="card bookingBox" id="booking">
                  <h2>Book this location</h2>
                  <p className="muted">Choose a date and we&apos;ll hold the details for your trip.</p>
                  <form className="stack" onSubmit={handleBookingSubmit}>
                    <label className="field">
                      <span>Travel date</span>
                      <input id="travel-date" name="bookingDate" value={bookingDate} onChange={(event) => setBookingDate(event.target.value)} type="date" min={today} required />
                    </label>
                    <label className="field">
                      <span>Travelers</span>
                      <input id="travelers" name="numberOfPeople" value={numberOfPeople} onChange={(event) => setNumberOfPeople(Number(event.target.value))} type="number" min={1} max={20} required />
                    </label>
                    <button className="primaryButton" type="submit" disabled={bookingLoading}> {bookingLoading ? "Confirming..." : "Book now"}</button>
                  </form>
                  {bookingMessage ? <div className="notice" role="status">{bookingMessage}</div> : null}
                  {bookingError ? <div className="error" role="alert">{bookingError}</div> : null}
                  <Link href="/login" className="cardLink">Need to login first? <span aria-hidden="true">-&gt;</span></Link>
                </article>
              </aside>
            </section>
            {showConfirmation ? (
              <div className="modalBackdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setShowConfirmation(false)}>
                <section className="contactModal" role="dialog" aria-modal="true" aria-labelledby="booking-confirmation-title">
                  <h2 id="booking-confirmation-title">Confirm your booking</h2>
                  <p className="muted">{numberOfPeople} traveler{numberOfPeople === 1 ? "" : "s"} × ₹10,000</p>
                  <p>Total simulated payment: <strong>₹{(numberOfPeople * 10000).toLocaleString("en-IN")}</strong></p>
                  <div className="heroActions">
                    <button className="secondaryButton" type="button" onClick={() => setShowConfirmation(false)}>Cancel</button>
                    <button className="primaryButton" type="button" onClick={confirmBooking} disabled={bookingLoading}>Yes, confirm booking</button>
                  </div>
                </section>
              </div>
            ) : null}
            {location.similarLocations?.length ? (
              <section className="section relatedSection">
                <div className="sectionHeading">
                  <div>
                    <div className="eyebrow">Keep exploring</div>
                    <h2>Similar escapes</h2>
                    <p>More places with a similar travel style.</p>
                  </div>
                </div>
                <div className="grid">
                  {location.similarLocations.map((similar) => <LocationCard key={similar.projectId} location={similar} />)}
                </div>
              </section>
            ) : null}
          </div>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
