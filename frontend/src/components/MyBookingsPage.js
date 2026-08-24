"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { fetchMyBookings } from "@/services/api";
import { getAuthState } from "@/services/auth-storage";

export function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requiresLogin, setRequiresLogin] = useState(false);

  useEffect(() => {
    let mounted = true;
    const auth = getAuthState();

    if (!auth?.token) {
      setRequiresLogin(true);
      setLoading(false);
      return () => {
        mounted = false;
      };
    }

    fetchMyBookings(auth.token)
      .then((items) => mounted && setBookings(items))
      .catch((err) => mounted && setError(err.message))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="page">
      <Navbar />
      <main className="container section">
        <div className="sectionHeading">
          <div>
            <h1>My Bookings</h1>
            <p>Authenticated bookings returned from the backend.</p>
          </div>
        </div>
        {loading ? (
          <div className="card contentCard">Loading bookings...</div>
        ) : requiresLogin ? (
          <div className="notice">
            Please <Link href="/login">login</Link> to view your bookings.
          </div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="notice">
            No bookings yet. <Link href="/">Explore destinations</Link>
          </div>
        ) : (
          <div className="stack">
            {bookings.map((booking) => (
              <article key={booking.id} className="card contentCard">
                <strong>{booking.locationName}</strong>
                <p className="muted">
                  {booking.bookingDate} | {booking.numberOfPeople} travelers | {booking.status}
                </p>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
