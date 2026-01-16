"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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

function statusLabel(s: InventoryRow["status"]) {
  if (s === "in_stock") return "In stock";
  if (s === "limited") return "Limited";
  return "Out of stock";
}

export default function AdminInventoryClient() {

  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";

  const router = useRouter();

  const [token, setToken] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [items, setItems] = useState<InventoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  // New item form
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newStatus, setNewStatus] = useState<InventoryRow["status"]>("in_stock");
  const [newDesc, setNewDesc] = useState("");

  const inventoryUrl = useMemo(() => {
    if (!category) return `${API_URL}/inventory`;
    return `${API_URL}/inventory?category=${encodeURIComponent(category)}`;
  }, [category]);

  useEffect(() => {
    const t = localStorage.getItem("admin_access_token") || "";
    if (!t) router.push("/admin/login");
    setToken(t);
  }, [router]);

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
      setCategories(cats);
      setItems(inv);
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

  function updateLocal(id: number, patch: Partial<InventoryRow>) {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }

  async function saveRow(row: InventoryRow) {
    setSavingId(row.id);
    setErr(null);
    setMsg(null);

    try {
      const res = await fetch(`${API_URL}/inventory/${row.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: row.name,
          category: row.category,
          price: row.price === "" ? undefined : row.price,
          status: row.status,
          description: row.description ?? undefined,
          imageUrl: row.imageUrl ?? undefined,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Save failed");
      }

      setMsg(`Saved item #${row.id}.`);
      await load();
    } catch (e: any) {
      setErr(e?.message || "Save failed");
    } finally {
      setSavingId(null);
    }
  }

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);

    try {
      const res = await fetch(`${API_URL}/inventory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newName,
          category: newCategory,
          price: newPrice ? newPrice : undefined,
          status: newStatus,
          description: newDesc ? newDesc : undefined,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Create failed");
      }

      setMsg("Item created.");
      setNewName("");
      setNewCategory("");
      setNewPrice("");
      setNewStatus("in_stock");
      setNewDesc("");

      await load();
    } catch (e: any) {
      setErr(e?.message || "Create failed");
    }
  }

  function logout() {
    localStorage.removeItem("admin_access_token");
    router.push("/admin/login");
  }

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 16px 48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 900 }}>Admin • Inventory</h1>
            <p style={{ color: "#444", marginTop: 10, lineHeight: 1.6 }}>
              Add items and update availability. Prices use format <b>3.47</b>.
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

        {/* Add item */}
        <section style={{ marginTop: 16, border: "1px solid #eee", borderRadius: 16, padding: 16, background: "white" }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>Add New Item</h2>

          <form
            onSubmit={addItem}
            style={{
              marginTop: 12,
              display: "grid",
              gap: 10,
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
            <input required placeholder="Name" value={newName} onChange={(e) => setNewName(e.target.value)} style={inputStyle} />
            <input required placeholder="Category" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} style={inputStyle} />
            <input placeholder="Price (optional) e.g. 3.47" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} style={inputStyle} />

            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value as any)} style={inputStyle}>
              <option value="in_stock">{statusLabel("in_stock")}</option>
              <option value="limited">{statusLabel("limited")}</option>
              <option value="out_of_stock">{statusLabel("out_of_stock")}</option>
            </select>

            <input placeholder="Description (optional)" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} style={inputStyle} />

            <button type="submit" style={primaryBtnStyle}>
              Create
            </button>
          </form>
        </section>

        {/* Filters */}
        <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <a href="/admin/inventory" style={chipStyle(!category)}>All</a>
          {categories.map((c) => (
            <a
              key={c}
              href={`/admin/inventory?category=${encodeURIComponent(c)}`}
              style={chipStyle(category === c)}
            >
              {c}
            </a>
          ))}
        </div>

        {/* List */}
        <section style={{ marginTop: 12, border: "1px solid #eee", borderRadius: 16, background: "white" }}>
          {loading ? (
            <div style={{ padding: 16, color: "#666" }}>Loading…</div>
          ) : (
            <div style={{ padding: 10, display: "grid", gap: 10 }}>
              {items.map((row) => (
                <div key={row.id} style={{ border: "1px solid #eee", borderRadius: 14, padding: 12 }}>
                  <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 160px 180px" }}>
                    <div>
                      <div style={{ fontWeight: 900 }}>
                        #{row.id} — {row.name}
                      </div>
                      <div style={{ marginTop: 6, color: "#555", fontSize: 13 }}>{row.category}</div>
                      {row.description ? <div style={{ marginTop: 8, color: "#666", fontSize: 13 }}>{row.description}</div> : null}
                    </div>

                    <div style={{ display: "grid", gap: 8 }}>
                      <label style={smallLabel}>Price</label>
                      <input
                        value={row.price ?? ""}
                        onChange={(e) => updateLocal(row.id, { price: e.target.value })}
                        placeholder="e.g. 3.47"
                        style={inputStyle}
                      />
                      <label style={smallLabel}>Status</label>
                      <select
                        value={row.status}
                        onChange={(e) => updateLocal(row.id, { status: e.target.value as any })}
                        style={inputStyle}
                      >
                        <option value="in_stock">{statusLabel("in_stock")}</option>
                        <option value="limited">{statusLabel("limited")}</option>
                        <option value="out_of_stock">{statusLabel("out_of_stock")}</option>
                      </select>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10 }}>
                      <button
                        onClick={() => saveRow(row)}
                        disabled={savingId === row.id}
                        style={{
                          border: "none",
                          borderRadius: 12,
                          padding: "10px 14px",
                          background: "#111",
                          color: "white",
                          fontWeight: 900,
                          cursor: savingId === row.id ? "not-allowed" : "pointer",
                          width: "100%",
                        }}
                      >
                        {savingId === row.id ? "Saving…" : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {items.length === 0 && <div style={{ padding: 8, color: "#666" }}>No items found.</div>}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #ddd",
  width: "100%",
};

const primaryBtnStyle: React.CSSProperties = {
  border: "none",
  borderRadius: 12,
  padding: "10px 14px",
  background: "#111",
  color: "white",
  fontWeight: 900,
  cursor: "pointer",
  width: "100%",
};

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

const smallLabel: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 900,
  color: "#111",
};
