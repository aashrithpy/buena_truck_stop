"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import { useSearchParams } from "next/navigation";

type InventoryRow = {
  id: number;
  name: string;
  category: string;
  price: string | null;
  status: "in_stock" | "limited" | "out_of_stock";
  description: string | null;
  imageUrl: string | null;
  updatedAt: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function statusText(s: InventoryRow["status"]) {
  if (s === "in_stock") return "In stock";
  if (s === "limited") return "Limited";
  return "Out of stock";
}

/**
 * Mobile-safe gutters so text/cards never touch the screen edge.
 * - Uses CSS env() for iPhone safe-area (notch/rounded corners)
 */
const containerGutter: React.CSSProperties = {
  paddingLeft: "calc(16px + env(safe-area-inset-left))",
  paddingRight: "calc(16px + env(safe-area-inset-right))",
};

const imgWrapStyle: React.CSSProperties = {
  width: "100%",
  aspectRatio: "4 / 3",
  borderRadius: 14,
  overflow: "hidden",
  border: "1px solid var(--border)",
  background: "#f4f4f4",
};

const imgStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

export default function InventoryClient() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";

  const [categories, setCategories] = useState<string[]>([]);
  const [items, setItems] = useState<InventoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const inventoryUrl = useMemo(() => {
    if (!category) return `${API_URL}/inventory`;
    return `${API_URL}/inventory?category=${encodeURIComponent(category)}`;
  }, [category]);

  async function load() {
    setLoading(true);
    setErr(null);

    try {
      const [cRes, iRes] = await Promise.all([
        fetch(`${API_URL}/inventory/categories`, { cache: "no-store" }),
        fetch(inventoryUrl, { cache: "no-store" }),
      ]);

      if (!cRes.ok) throw new Error("Failed to load categories");
      if (!iRes.ok) throw new Error("Failed to load inventory");

      const [cats, inv] = await Promise.all([cRes.json(), iRes.json()]);
      setCategories(Array.isArray(cats) ? cats : []);
      setItems(Array.isArray(inv) ? inv : []);
    } catch (e: any) {
      setErr(e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inventoryUrl]);

  return (
    <>
      <Navbar />

      <main className="container" style={{ ...containerGutter, padding: "28px 0 48px" }}>
        <h1 className="h2" style={{ fontSize: 28 }}>
          Inventory
        </h1>
        <p className="p">Browse what’s currently available in the store.</p>

        {/* Category chips */}
        <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <a href="/inventory" style={chipStyle(!category)}>
            All
          </a>
          {categories.map((c) => (
            <a
              key={c}
              href={`/inventory?category=${encodeURIComponent(c)}`}
              style={chipStyle(category === c)}
            >
              {c}
            </a>
          ))}
        </div>

        {err && <div style={{ marginTop: 14, color: "#b00", fontWeight: 800 }}>{err}</div>}

        {/* Items */}
        <section style={{ marginTop: 14 }}>
          {loading ? (
            <div style={{ color: "#666" }}>Loading…</div>
          ) : items.length === 0 ? (
            <div style={{ color: "#666" }}>No items found.</div>
          ) : (
            <div
              style={{
                marginTop: 12,
                display: "grid",
                gap: 14,
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              }}
            >
              {items.map((item) => (
                <div key={item.id} className="card" style={{ overflow: "hidden", padding: 14 }}>
                  {/* Image */}
                  <div style={imgWrapStyle}>
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} style={imgStyle} loading="lazy" />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "grid",
                          placeItems: "center",
                          color: "#777",
                          fontSize: 13,
                          fontWeight: 800,
                        }}
                      >
                        No image
                      </div>
                    )}
                  </div>

                  {/* Text */}
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontWeight: 900 }}>{item.name}</div>
                    <div style={{ marginTop: 6, color: "#666", fontSize: 13 }}>{item.category}</div>

                    <div
                      style={{
                        marginTop: 12,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <div style={{ fontWeight: 900 }}>{item.price ? `$${item.price}` : ""}</div>

                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 900,
                          padding: "6px 10px",
                          borderRadius: 999,
                          border: "1px solid #ddd",
                          background: "white",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {statusText(item.status)}
                      </span>
                    </div>

                    {item.description ? (
                      <div style={{ marginTop: 10, color: "#666", fontSize: 13, lineHeight: 1.5 }}>
                        {item.description}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

function chipStyle(active: boolean): React.CSSProperties {
  return {
    textDecoration: "none",
    padding: "8px 12px",
    borderRadius: 999,
    border: active ? "1px solid #111" : "1px solid #ddd",
    color: active ? "#111" : "#333",
    fontWeight: 900,
    background: active ? "rgba(0,0,0,0.04)" : "white",
  };
}
