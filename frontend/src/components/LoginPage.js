"use client";

import { useState } from "react";
import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { sendOtp, verifyOtp } from "@/services/api";
import { setAuthState } from "@/services/auth-storage";

export function LoginPage() {
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);

  async function handleSendOtp() {
    setError(null);
    setMessage(null);
    try {
      const response = await sendOtp({ name, countryCode, mobile });
      setSent(true);
      setMessage(`OTP sent. Demo OTP: ${response.devOtp || "123456"}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send OTP");
    }
  }

  async function handleVerifyOtp() {
    setError(null);
    setMessage(null);
    try {
      const auth = await verifyOtp({ name, countryCode, mobile, otp, role: "USER" });
      setAuthState(auth);
      setMessage("Logged in successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not verify OTP");
    }
  }

  return (
    <div className="page">
      <Navbar />
      <main className="container section">
        <div className="card contentCard" style={{ maxWidth: 560, margin: "0 auto" }}>
          <h1 className="heroTitle" style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)" }}>
            Login
          </h1>
          <p className="heroCopy">Use the OTP flow to create a JWT-backed session for bookings.</p>
          <div className="stack">
            <label className="field">
              <span>Name</span>
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" />
            </label>
            <label className="field">
              <span>Country Code</span>
              <input value={countryCode} onChange={(event) => setCountryCode(event.target.value)} placeholder="+91" />
            </label>
            <label className="field">
              <span>Mobile</span>
              <input value={mobile} onChange={(event) => setMobile(event.target.value)} placeholder="9876543210" />
            </label>
            <button className="secondaryButton" onClick={handleSendOtp} type="button">
              Send OTP
            </button>
            {sent ? (
              <>
                <label className="field">
                  <span>OTP</span>
                  <input value={otp} onChange={(event) => setOtp(event.target.value)} placeholder="123456" />
                </label>
                <button className="primaryButton" onClick={handleVerifyOtp} type="button">
                  Verify OTP
                </button>
              </>
            ) : null}
            {message ? <div className="notice">{message}</div> : null}
            {error ? <div className="error">{error}</div> : null}
            <Link href="/" className="cardLink">
              Back to home <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
