import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footerGrid">
        <div>
          <strong>Smart Tour</strong>
          <div className="muted">Backend-driven travel booking demo</div>
        </div>
        <div className="navLinks">
          <Link href="/#explore">Explore</Link>
          <Link href="/login">Login</Link>
          <Link href="/my-bookings">My Bookings</Link>
        </div>
        <div>Copyright {new Date().getFullYear()}</div>
      </div>
    </footer>
  );
}
