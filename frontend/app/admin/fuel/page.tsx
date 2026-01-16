"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

type FuelRow = {
  id: number;
  type: "diesel" | "gas" | "premium" | "off_road_diesel" | "propane";
  price: string | null;
  available: boolean;
  updatedAt: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function label(type: FuelRow["type"]) {
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
  }
}

export default function AdminFuelPage() {
  const router = useRouter();

  const [token, setToken] = useState("");
  const [fuel, setFuel] = useState<FuelRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("admin_access_token") || "";
    if (!t) router.push("/admin/login");
    setToken(t);
  }, [router]);

  async function loadFuel() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`${API_URL}/fuel`);
      if (!res.ok) throw new Error("Failed to load fuel");
      setFuel(await res.json());
    } catch (e: any) {
      setErr(e?.message || "Failed to load fuel");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFuel();
  }, []);

  function updateLocal(type: FuelRow["type"], patch: Partial<FuelRow>) {
    setFuel((prev) => prev.map((f) => (f.type === type ? { ...f, ...patch } : f)));
  }

  async function saveRow(row: FuelRow) {
    setSaving(row.type);
    setErr(null);
    setMsg(null);

    try {
      const res = await fetch(`${API_URL}/fuel`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: row.type,
          price: row.price === "" ? undefined : row.price,
          available: row.available,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Save failed");
      }

      setMsg(`Saved ${label(row.type)}.`);
      await loadFuel();
    } catch (e: any) {
      setErr(e?.message || "Save failed");
    } finally {
      setSaving(null);
    }
  }

  function logout() {
    localStorage.removeItem("admin_access_token");
    router.push("/admin/login");
  }

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "28px 16px 48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 900 }}>Admin • Fuel Prices</h1>
            <p style={{ color: "#444", marginTop: 10, lineHeight: 1.6 }}>
              Update prices and availability. Use format <b>3.47</b>.
            </p>
          </div>

          <button
            onClick={logout}
            style={{
              border: "1px solid #ddd",
              background: "white",
              borderRadius: 12,
              padding: "10px 12px",
              fontWeight: 900,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Log out
          </button>
        </div>

        {err && <div style={{ marginTop: 14, color: "#b00", whiteSpace: "pre-wrap" }}>{err}</div>}
        {msg && <div style={{ marginTop: 14, color: "#0a5" }}>{msg}</div>}

        <div style={{ marginTop: 16, border: "1px solid #eee", borderRadius: 16, background: "white" }}>
          {loading ? (
            <div style={{ padding: 16, color: "#666" }}>Loading…</div>
          ) : (
            <div style={{ padding: 8 }}>
              {fuel.map((row) => (
                <div
                  key={row.type}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 170px 170px",
                    gap: 10,
                    alignItems: "center",
                    padding: 10,
                    borderRadius: 12,
                  }}
                >
                  <div style={{ fontWeight: 900 }}>{label(row.type)}</div>

                  <input
                    value={row.price ?? ""}
                    onChange={(e) => updateLocal(row.type, { price: e.target.value })}
                    placeholder="e.g. 3.47"
                    style={{
                      padding: "10px 12px",
                      borderRadius: 12,
                      border: "1px solid #ddd",
                      width: "100%",
                    }}
                  />

                  <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "flex-end" }}>
                    <label style={{ display: "flex", gap: 8, alignItems: "center", fontWeight: 800 }}>
                      <input
                        type="checkbox"
                        checked={row.available}
                        onChange={(e) => updateLocal(row.type, { available: e.target.checked })}
                      />
                      Available
                    </label>

                    <button
                      onClick={() => saveRow(row)}
                      disabled={saving === row.type}
                      style={{
                        border: "none",
                        borderRadius: 12,
                        padding: "10px 12px",
                        background: "#111",
                        color: "white",
                        fontWeight: 900,
                        cursor: saving === row.type ? "not-allowed" : "pointer",
                      }}
                    >
                      {saving === row.type ? "Saving…" : "Save"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
