"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  receipts: string[] | null;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function AdminCustomersClient() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [receiptsInput, setReceiptsInput] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("admin_access_token") || "";
    if (!t) {
      router.push("/admin/login");
      return;
    }
    setToken(t);
  }, [router]);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`${API_URL}/customers`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to load customers");
      const data = await res.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setErr(e?.message || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function createCustomer(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);

    const receipts = receiptsInput
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    try {
      const res = await fetch(`${API_URL}/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          address: address || undefined,
          password,
          receipts: receipts.length ? receipts : undefined,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Create failed");
      }

      setMsg("Customer created.");
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setPassword("");
      setReceiptsInput("");
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
        <div className="adminHeader">
          <div>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 900 }}>Admin • Customers</h1>
            <p style={{ color: "#444", marginTop: 10, lineHeight: 1.6 }}>
              Create customer accounts that can log in with the credentials you provide.
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

        <section style={{ marginTop: 16, border: "1px solid #eee", borderRadius: 16, padding: 16, background: "white" }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>Create Customer</h2>
          <form
            onSubmit={createCustomer}
            style={{
              marginTop: 12,
              display: "grid",
              gap: 10,
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
            <input required placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
            <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
            <input placeholder="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />
            <input placeholder="Address (optional)" value={address} onChange={(e) => setAddress(e.target.value)} style={inputStyle} />
            <input
              required
              type="password"
              placeholder="Temporary password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
            <textarea
              placeholder="Receipts (optional, one per line)"
              value={receiptsInput}
              onChange={(e) => setReceiptsInput(e.target.value)}
              style={{ ...inputStyle, minHeight: 110, resize: "vertical", gridColumn: "1 / -1" }}
            />
            <button type="submit" style={primaryBtnStyle}>
              Create
            </button>
          </form>
        </section>

        <section style={{ marginTop: 16, border: "1px solid #eee", borderRadius: 16, background: "white" }}>
          {loading ? (
            <div style={{ padding: 16, color: "#666" }}>Loading…</div>
          ) : (
            <div className="customerGrid">
              {customers.map((customer) => (
                <div key={customer.id} style={{ border: "1px solid #eee", borderRadius: 14, padding: 14 }}>
                  <div style={{ fontWeight: 900 }}>{customer.name}</div>
                  <div style={{ fontSize: 13, color: "#555", marginTop: 6 }}>{customer.email}</div>
                  {customer.phone && <div style={{ fontSize: 13, color: "#555", marginTop: 6 }}>📞 {customer.phone}</div>}
                  {customer.address && <div style={{ fontSize: 13, color: "#555", marginTop: 6 }}>🏠 {customer.address}</div>}

                  {customer.receipts && customer.receipts.length > 0 ? (
                    <div style={{ marginTop: 10 }}>
                      <div style={{ fontSize: 12, fontWeight: 900 }}>Receipts</div>
                      <ul style={{ margin: "6px 0 0", paddingLeft: 16, color: "#555", fontSize: 13 }}>
                        {customer.receipts.map((r, idx) => (
                          <li key={`${customer.id}-${idx}`}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div style={{ marginTop: 10, fontSize: 12, color: "#777" }}>No receipts on file.</div>
                  )}
                </div>
              ))}

              {customers.length === 0 && <div style={{ padding: 16, color: "#666" }}>No customers yet.</div>}
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

          .customerGrid {
            display: grid;
            gap: 12px;
            padding: 12px;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
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
