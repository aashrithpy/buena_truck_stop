"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      {/* Top Banner */}
      <div
        style={{
          background: "var(--brand-red)",
          color: "white",
          padding: "10px 16px",
          textAlign: "center",
          fontWeight: 800,
          fontSize: 13,
          letterSpacing: "0.03em",
        }}
      >
        ⏰ WEEKDAYS 5AM–10PM • WEEKENDS 6AM–10PM
      </div>

      {/* Sticky Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "white",
          borderBottom: "4px solid var(--brand-blue)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 0",
            gap: 12,
          }}
        >
          <Link href="/" style={{ fontFamily: "Oswald, sans-serif", fontSize: 22, fontWeight: 700, textTransform: "uppercase" }}>
            Buena Truck Stop
          </Link>

          {/* Desktop nav */}
          <nav className="desktopNav" style={{ display: "none", gap: 16, alignItems: "center" }}>
            <a href="/#fuel" style={navLink}>Fuel</a>
            <a href="/#services" style={navLink}>Services</a>
            <a href="/#contact" style={navLink}>Contact</a>
          </nav>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <Link className="btnPrimary" href="/inventory">📦 Inventory</Link>
            <Link className="btnSecondary" href="/customer/login">Customer Login</Link>
            <Link className="btnSecondary" href="/admin/login">Admin Sign In</Link>

            {/* Mobile hamburger */}
            <button
              className="mobileOnly"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              style={{
                border: "1px solid var(--border)",
                background: "white",
                borderRadius: 10,
                padding: "10px 12px",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              ☰
            </button>
          </div>
        </div>

        <style jsx global>{`
          @media (min-width: 900px) {
            .desktopNav { display: flex !important; }
            .mobileOnly { display: none !important; }
          }
        `}</style>
      </header>

      {/* Mobile Drawer */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            zIndex: 200,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              height: "100%",
              width: "min(360px, 92vw)",
              background: "white",
              padding: 16,
              boxShadow: "-12px 0 30px rgba(0,0,0,0.15)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, textTransform: "uppercase" }}>
                Menu
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                style={{
                  border: "1px solid var(--border)",
                  background: "white",
                  borderRadius: 10,
                  padding: "8px 10px",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            <a href="/#fuel" onClick={() => setOpen(false)} style={drawerLink}>Fuel</a>
            <a href="/#services" onClick={() => setOpen(false)} style={drawerLink}>Services</a>
            <a href="/#contact" onClick={() => setOpen(false)} style={drawerLink}>Contact</a>

            <Link href="/inventory" onClick={() => setOpen(false)} className="btnPrimary">
              📦 Inventory
            </Link>
            <Link href="/customer/login" onClick={() => setOpen(false)} className="btnSecondary">
              Customer Login
            </Link>
            <Link href="/admin/login" onClick={() => setOpen(false)} className="btnSecondary">
              Admin Sign In
            </Link>

            <div style={{ marginTop: "auto", color: "#666", fontSize: 13, lineHeight: 1.5 }}>
              760 S Harding Hwy, Buena, NJ<br />
              (856) 697-3887
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const navLink: React.CSSProperties = {
  fontFamily: "Oswald, sans-serif",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  fontSize: 14,
  color: "#111",
};

const drawerLink: React.CSSProperties = {
  border: "1px solid var(--border)",
  borderRadius: 12,
  padding: "10px 12px",
  fontFamily: "Oswald, sans-serif",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};
