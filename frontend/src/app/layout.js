import "@/app/globals.css";

export const metadata = {
  title: "Smart Tour",
  description: "Backend-driven travel booking demo built with FastAPI and Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
