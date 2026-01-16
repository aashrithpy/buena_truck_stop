"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";


type FuelRow = {
  id: number;
  type: "diesel" | "gas" | "premium" | "off_road_diesel" | "propane";
  price: string | null;
  available: boolean;
  updatedAt: string;
};

type ServiceRow = {
  id: number;
  name: string;
  description: string | null;
  enabled: boolean;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function titleCaseFuel(type: FuelRow["type"]) {
  switch (type) {
    case "off_road_diesel":
      return "Off-road Diesel";
    case "gas":
      return "Gas";
    case "diesel":
      return "Diesel";
    case "premium":
      return "Premium";
    case "propane":
      return "Propane";
    default:
      return type;
  }
}

export default function HomeClient() {
  const [fuel, setFuel] = useState<FuelRow[]>([]);
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [fRes, sRes] = await Promise.all([
          fetch(`${API_URL}/fuel`, { cache: "no-store" }),
          fetch(`${API_URL}/services`, { cache: "no-store" }),
        ]);
        const [f, s] = await Promise.all([
          fRes.ok ? fRes.json() : [],
          sRes.ok ? sRes.json() : [],
        ]);
        setFuel(f);
        setServices(s);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const pricedFuel = useMemo(() => fuel.filter((f) => f.price !== null && f.available), [fuel]);
  const otherFuel = useMemo(() => fuel.filter((f) => f.price === null && f.available), [fuel]);
  const enabledServices = useMemo(() => services.filter((s) => s.enabled), [services]);

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section style={{ position: "relative" }}>
        <div style={{ position: "relative", height: "70vh", minHeight: 480 }}>
          <Image src="/photos/main.png" alt="Buena Truck Stop" fill priority style={{ objectFit: "cover" }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.30) 45%, rgba(0,0,0,0.72) 100%)",
            }}
          />

          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end" }}>
            <div className="container" style={{ paddingBottom: 36 }}>
              <h1 className="h1" style={{ color: "white" }}>
                Buena Truck Stop
              </h1>

              <p className="p" style={{ color: "rgba(255,255,255,0.92)", maxWidth: 760 }}>
                Convenience store, gas, diesel, off-road diesel, and propane filling.
              </p>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
                <span style={heroPill}>Weekdays: 5:00am – 10:00pm</span>
                <span style={heroPill}>Weekends: 6:00am – 10:00pm</span>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
                <a className="btnPrimary" href="#fuel">View Fuel Prices</a>
                <a className="btnSecondary" href="#services">Services</a>
                <a className="btnSecondary" href="#contact">Contact</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FUEL */}
      <section id="fuel" className="sectionBlue">
        <div className="container" style={{ padding: "44px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <h2 className="h2">Fuel Prices</h2>
              <p className="p" style={{ color: "rgba(255,255,255,0.9)" }}>Prices subject to change.</p>
              {loading && <div style={{ marginTop: 10, color: "rgba(255,255,255,0.9)" }}>Loading…</div>}
            </div>

            {otherFuel.length > 0 && (
              <div style={{ alignSelf: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Also available
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                  {otherFuel.map((x) => (
                    <span key={x.id} style={alsoPill}>{titleCaseFuel(x.type)}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {pricedFuel.length === 0 && !loading ? (
            <div style={{ marginTop: 16, color: "rgba(255,255,255,0.9)" }}>No prices available.</div>
          ) : (
            <div className="grid3" style={{ marginTop: 18 }}>
              {pricedFuel.map((f) => (
                <div
                  key={f.id}
                  className="card"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    borderColor: "rgba(255,255,255,0.18)",
                    color: "white",
                    padding: 16,
                  }}
                >
                  <div style={{ fontFamily: "Oswald, sans-serif", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {titleCaseFuel(f.type)}
                  </div>
                  <div style={{ marginTop: 10, fontSize: 30, fontWeight: 900 }}>${f.price}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services">
        <div className="container" style={{ padding: "44px 0" }}>
          <h2 className="h2">Services & Amenities</h2>
          <p className="p">Basic driver essentials and quick stops.</p>

          {enabledServices.length === 0 && !loading ? (
            <div style={{ marginTop: 14, color: "#666" }}>No services available.</div>
          ) : (
            <div style={{ marginTop: 18, display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
              {enabledServices.map((s) => (
                <div key={s.id} className="card" style={{ padding: 16 }}>
                  <div style={{ fontWeight: 900 }}>{s.name}</div>
                  <div style={{ marginTop: 8, color: "#666", lineHeight: 1.5, fontSize: 14 }}>
                    {s.description || "Available at the truck stop."}
                  </div>
                </div>
              ))}
            </div>
          )}

        
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="sectionDark">
        <div className="container" style={{ padding: "44px 0" }}>
          <h2 className="h2">Visit Us</h2>
          <p className="p" style={{ color: "rgba(255,255,255,0.9)" }}>Call ahead or get directions.</p>

          <div style={{ marginTop: 18, display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            <div className="card" style={infoCard}>
              <div style={infoLabel}>Address</div>
              <div style={infoValue}>760 S Harding Hwy<br />Buena, NJ</div>
            </div>
            <div className="card" style={infoCard}>
              <div style={infoLabel}>Phone</div>
              <div style={infoValue}>(856) 697-3887</div>
            </div>
            <div className="card" style={infoCard}>
              <div style={infoLabel}>Hours</div>
              <div style={infoValue}>
                Weekdays: 5:00am – 10:00pm<br />
                Weekends: 6:00am – 10:00pm
              </div>
            </div>
          </div>

          <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a
              className="btnPrimary"
              href="https://www.google.com/maps/search/?api=1&query=760%20S%20Harding%20Hwy%2C%20Buena%2C%20NJ"
              target="_blank"
              rel="noreferrer"
            >
              Get Directions
            </a>
            <a
              className="btnSecondary"
              href="tel:+18566973887"
              style={{ background: "transparent", color: "white", borderColor: "rgba(255,255,255,0.35)" }}
            >
              Call Now
            </a>
          </div>
        </div>
      </section>

      <footer style={{ borderTop: "4px solid var(--brand-blue)", background: "white" }}>
        <div className="container" style={{ padding: "20px 0", color: "#555", fontSize: 13, lineHeight: 1.6 }}>
          © {new Date().getFullYear()} Buena Truck Stop • 760 S Harding Hwy, Buena, NJ • (856) 697-3887
        </div>
      </footer>
    </>
  );
}

const heroPill: React.CSSProperties = {
  color: "white",
  border: "1px solid rgba(255,255,255,0.35)",
  padding: "8px 12px",
  borderRadius: 999,
  fontWeight: 800,
  fontSize: 13,
};

const alsoPill: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.35)",
  padding: "6px 10px",
  borderRadius: 999,
  color: "white",
  fontWeight: 800,
  fontSize: 13,
};

const infoCard: React.CSSProperties = {
  padding: 16,
  background: "rgba(255,255,255,0.10)",
  borderColor: "rgba(255,255,255,0.18)",
};

const infoLabel: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.9)",
};

const infoValue: React.CSSProperties = {
  marginTop: 10,
  fontSize: 16,
  fontWeight: 900,
  color: "white",
  lineHeight: 1.4,
};
