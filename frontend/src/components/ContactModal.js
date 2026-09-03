"use client";

import { useEffect, useRef, useState } from "react";

export function ContactModal({ open, onClose }) {
  const closeRef = useRef(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSent(false);
    closeRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  function handleSubmit(event) {
    event.preventDefault();
    setSent(true);
    window.setTimeout(onClose, 900);
  }

  return (
    <div className="modalBackdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="contactModal" role="dialog" aria-modal="true" aria-labelledby="contact-title">
        <div className="modalHeader">
          <div>
            <div className="eyebrow">We are listening</div>
            <h2 id="contact-title">Tell us where you want to go</h2>
          </div>
          <button ref={closeRef} className="modalClose" type="button" onClick={onClose} aria-label="Close contact form">X</button>
        </div>
        {sent ? (
          <div className="notice" role="status">Thanks. We&apos;ll get back to you soon.</div>
        ) : (
          <form className="stack" onSubmit={handleSubmit}>
            <label className="field"><span>Name</span><input name="name" required placeholder="Your name" /></label>
            <label className="field"><span>Email</span><input name="email" type="email" required placeholder="you@example.com" /></label>
            <label className="field"><span>Message</span><textarea name="message" required rows="4" placeholder="What can we help you plan?" /></label>
            <button className="primaryButton" type="submit">Send message</button>
          </form>
        )}
      </section>
    </div>
  );
}
