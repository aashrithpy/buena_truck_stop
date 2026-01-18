"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";

type InventoryRow = {
  id: number;
  name: string;
  category: string;
  price: string | null;
  status: "in_stock" | "limited" | "out_of_stock";
  description: string | null;
  imageUrl: string | null;
  featured?: boolean;
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
  const featuredOnly = searchParams.get("featured") === "1";

  const router = useRouter();

  const [token, setToken] = useState("");
  const [authReady, setAuthReady] = useState(false);
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
  const [newImageUrl, setNewImageUrl] = useState("");
  const [uploadingNew, setUploadingNew] = useState(false);
  const [uploadingId, setUploadingId] = useState<number | null>(null);

  const inventoryUrl = useMemo(() => {
    const qs = new URLSearchParams();
    if (category) qs.set("category", category);
    if (featuredOnly) qs.set("featured", "1");
    const q = qs.toString();
    return q ? `${API_URL}/inventory?${q}` : `${API_URL}/inventory`;
  }, [category, featuredOnly]);

  useEffect(() => {
    const t = localStorage.getItem("admin_access_token") || "";
    if (!t) {
      router.push("/admin/login");
      return;
    }
    setToken(t);
    setAuthReady(true);
  }, [router]);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const [cRes, iRes] = await Promise.all([
        fetch(`${API_URL}/inventory/categories`, { cache: "no-store" }),
        // backend doesn't filter featured=1 yet; remove it from request if present
        fetch(inventoryUrl.replace(/([?&])featured=1(&|$)/, "$1").replace(/\?&/, "?").replace(/\?$/, ""), {
          cache: "no-store",
        }),
      ]);

      if (!cRes.ok) throw new Error("Failed to load categories");
      if (!iRes.ok) throw new Error("Failed to load inventory");

      const [cats, invRaw] = await Promise.all([cRes.json(), iRes.json()]);
      const inv: InventoryRow[] = Array.isArray(invRaw) ? invRaw : [];

      setCategories(cats);
      setItems(featuredOnly ? inv.filter((x) => !!x.featured) : inv);
    } catch (e: any) {
      setErr(e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!authReady) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady, inventoryUrl]);

  function updateLocal(id: number, patch: Partial<InventoryRow>) {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }

  async function uploadImage(file: File) {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch(`${API_URL}/inventory/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Image upload failed");
    }

    const data = await res.json();
    if (!data?.url) throw new Error("Upload did not return a URL");
    return data.url as string;
  }

  async function handleNewImage(file: File) {
    setErr(null);
    setUploadingNew(true);
    try {
      const url = await uploadImage(file);
      setNewImageUrl(url);
    } catch (e: any) {
      setErr(e?.message || "Image upload failed");
    } finally {
      setUploadingNew(false);
    }
  }

  async function handleRowImage(id: number, file: File) {
    setErr(null);
    setUploadingId(id);
    try {
      const url = await uploadImage(file);
      updateLocal(id, { imageUrl: url });
    } catch (e: any) {
      setErr(e?.message || "Image upload failed");
    } finally {
      setUploadingId(null);
    }
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
          imageUrl: row.imageUrl ?? undefined, // ✅ saves image url
          featured: !!row.featured, // ✅ saves featured
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
          imageUrl: newImageUrl ? newImageUrl : undefined, // ✅ new item image
          featured: false,
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
      setNewImageUrl("");

      await load();
    } catch (e: any) {
      setErr(e?.message || "Create failed");
    }
  }

  function logout() {
    localStorage.removeItem("admin_access_token");
    router.push("/admin/login");
  }

  function hrefFor(categoryValue: string, featuredValue: boolean) {
    const qs = new URLSearchParams();
    if (categoryValue) qs.set("category", categoryValue);
    if (featuredValue) qs.set("featured", "1");
    const q = qs.toString();
    return q ? `/admin/inventory?${q}` : "/admin/inventory";
  }

  if (!authReady) {
    return (
      <>
        <Navbar />
        <main style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 16px 48px" }}>
          <div style={{ padding: 16, color: "#666" }}>Checking admin session…</div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 16px 48px" }}>
        <div className="adminHeader">
          <div>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 900 }}>Admin • Inventory</h1>
            <p style={{ color: "#444", marginTop: 10, lineHeight: 1.6 }}>
              Add items and update availability. Prices use format <b>3.47</b>.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a
              href="/admin/fuel"
              style={{
                border: "1px solid #ddd",
                background: "white",
                borderRadius: 12,
                padding: "10px 12px",
                fontWeight: 900,
                whiteSpace: "nowrap",
                color: "#111",
                textDecoration: "none",
              }}
            >
              Fuel Prices
            </a>
            <a
              href="/admin/inventory"
              style={{
                border: "1px solid #111",
                background: "white",
                borderRadius: 12,
                padding: "10px 12px",
                fontWeight: 900,
                whiteSpace: "nowrap",
                color: "#111",
                textDecoration: "none",
              }}
            >
              Inventory
            </a>
            <a
              href="/admin/customers"
              style={{
                border: "1px solid #ddd",
                background: "white",
                borderRadius: 12,
                padding: "10px 12px",
                fontWeight: 900,
                whiteSpace: "nowrap",
                color: "#111",
                textDecoration: "none",
              }}
            >
              Customers
            </a>
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
            <input placeholder="Image URL (optional)" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} style={inputStyle} />
            <div style={{ display: "grid", gap: 6 }}>
              <label style={smallLabel}>Or upload image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleNewImage(file);
                }}
              />
              {uploadingNew && <span style={{ fontSize: 12, color: "#666" }}>Uploading…</span>}
            </div>

            <button type="submit" style={primaryBtnStyle}>
              Create
            </button>
          </form>

          {newImageUrl ? (
            <div style={{ marginTop: 12, fontSize: 13, color: "#444" }}>
              Preview:
              <div style={{ marginTop: 8, border: "1px solid #eee", borderRadius: 14, overflow: "hidden", maxWidth: 320 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={newImageUrl} alt="Preview" style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
              </div>
            </div>
          ) : null}
        </section>

        {/* Filters */}
        <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <a href={hrefFor("", featuredOnly)} style={chipStyle(!category)}>
            All
          </a>

          {categories.map((c) => (
            <a key={c} href={hrefFor(c, featuredOnly)} style={chipStyle(category === c)}>
              {c}
            </a>
          ))}

          <span style={{ width: 10 }} />

          <a href={hrefFor(category, false)} style={chipStyle(!featuredOnly)}>
            All Items
          </a>
          <a href={hrefFor(category, true)} style={chipStyle(featuredOnly)}>
            Featured
          </a>
        </div>

        {/* List */}
        <section style={{ marginTop: 12, border: "1px solid #eee", borderRadius: 16, background: "white" }}>
          {loading ? (
            <div style={{ padding: 16, color: "#666" }}>Loading…</div>
          ) : (
            <div style={{ padding: 10, display: "grid", gap: 10 }}>
              {items.map((row) => (
                <div key={row.id} style={{ border: "1px solid #eee", borderRadius: 14, padding: 12 }}>
                  <div className="inventoryRow">
                    {/* Left */}
                    <div>
                      <div style={{ fontWeight: 900 }}>
                        #{row.id} — {row.name}
                      </div>
                      <div style={{ marginTop: 6, color: "#555", fontSize: 13 }}>{row.category}</div>
                      {row.description ? <div style={{ marginTop: 8, color: "#666", fontSize: 13 }}>{row.description}</div> : null}

                      {row.imageUrl ? (
                        <div style={{ marginTop: 10, maxWidth: 260 }}>
                          <div style={{ fontSize: 12, fontWeight: 900, color: "#111" }}>Image Preview</div>
                          <div style={{ marginTop: 6, border: "1px solid #eee", borderRadius: 14, overflow: "hidden" }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={row.imageUrl} alt={row.name} style={{ width: "100%", height: 150, objectFit: "cover", display: "block" }} />
                          </div>
                        </div>
                      ) : null}
                    </div>

                    {/* Middle */}
                    <div style={{ display: "grid", gap: 8 }}>
                      <label style={smallLabel}>Price</label>
                      <input
                        value={row.price ?? ""}
                        onChange={(e) => updateLocal(row.id, { price: e.target.value })}
                        placeholder="e.g. 3.47"
                        style={inputStyle}
                      />

                      <label style={smallLabel}>Status</label>
                      <select value={row.status} onChange={(e) => updateLocal(row.id, { status: e.target.value as any })} style={inputStyle}>
                        <option value="in_stock">{statusLabel("in_stock")}</option>
                        <option value="limited">{statusLabel("limited")}</option>
                        <option value="out_of_stock">{statusLabel("out_of_stock")}</option>
                      </select>

                      <label style={smallLabel}>Image URL</label>
                      <input
                        value={row.imageUrl ?? ""}
                        onChange={(e) => updateLocal(row.id, { imageUrl: e.target.value })}
                        placeholder="https://..."
                        style={inputStyle}
                      />
                      <div style={{ display: "grid", gap: 6 }}>
                        <label style={smallLabel}>Upload image</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) void handleRowImage(row.id, file);
                          }}
                        />
                        {uploadingId === row.id && <span style={{ fontSize: 12, color: "#666" }}>Uploading…</span>}
                      </div>

                      {/* Featured toggle */}
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
                        <span style={{ ...smallLabel, margin: 0 }}>Featured</span>
                        <button
                          type="button"
                          onClick={() => updateLocal(row.id, { featured: !row.featured })}
                          aria-pressed={!!row.featured}
                          style={{
                            border: "1px solid",
                            borderColor: row.featured ? "#111" : "#ddd",
                            background: row.featured ? "#111" : "white",
                            color: row.featured ? "white" : "#111",
                            borderRadius: 999,
                            padding: "8px 12px",
                            fontWeight: 900,
                            cursor: "pointer",
                            width: "fit-content",
                          }}
                        >
                          {row.featured ? "Yes" : "No"}
                        </button>
                      </div>
                    </div>

                    {/* Right */}
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
        <style jsx>{`
          .adminHeader {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .inventoryRow {
            display: grid;
            gap: 10px;
            grid-template-columns: 1fr 240px 200px;
          }

          @media (max-width: 900px) {
            .inventoryRow {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
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
