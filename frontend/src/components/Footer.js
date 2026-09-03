"use client";

import Link from "next/link";
import { useState } from "react";

import { ContactModal } from "./ContactModal";

export function Footer() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <footer className="footer">
        <div className="container footerGrid">
          <div>
            <strong>Smart Tour</strong>
            <div className="muted">Backend-driven travel booking demo</div>
          </div>
          <div className="navLinks">
            <Link href="/#explore">Explore</Link>
            <Link href="/project">Destinations</Link>
            <Link href="/login">Login</Link>
            <Link href="/my-bookings">My Bookings</Link>
            <button type="button" onClick={() => setContactOpen(true)}>Contact</button>
          </div>
          <div>Copyright {new Date().getFullYear()}</div>
        </div>
      </footer>
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
