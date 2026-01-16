import Link from "next/link";

export default function Navbar() {
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.9)", borderBottom: "1px solid #eee" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ fontWeight: 700, textDecoration: "none", color: "#111" }}>
          Buena Truck Stop
        </Link>

        <nav style={{ display: "flex", gap: 16 }}>
          <a href="#services" style={{ textDecoration: "none", color: "#333" }}>Services</a>
          <a href="#fuel" style={{ textDecoration: "none", color: "#333" }}>Fuel Prices</a>
        </nav>

        <Link
          href="/coming-soon"
          style={{
            border: "1px solid #ddd",
            padding: "8px 12px",
            borderRadius: 10,
            textDecoration: "none",
            color: "#111",
            fontWeight: 600,
          }}
        >
          Create Account / Sign In
        </Link>
      </div>
    </header>
  );
}
