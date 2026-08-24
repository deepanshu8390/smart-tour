"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { clearAuthState, getAuthState } from "@/services/auth-storage";

export function Navbar() {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    setAuth(getAuthState());
  }, []);

  function handleLogout() {
    clearAuthState();
    setAuth(null);
  }

  return (
    <header className="topbar">
      <div className="container nav">
        <Link href="/" className="brand" aria-label="Smart Tour home">
          <span className="brandMark">ST</span>
          <span>Smart Tour</span>
        </Link>
        <nav className="navLinks" aria-label="Primary">
          <Link href="/#explore">Explore</Link>
          {auth ? (
            <>
              <span className="muted">{auth.name}</span>
              <Link href="/my-bookings">My Bookings</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
