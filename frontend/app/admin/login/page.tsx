"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@buena.local");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Login failed");
      }

      const data = await res.json();
      localStorage.setItem("admin_access_token", data.accessToken);
      router.push("/admin/fuel");
    } catch (e: any) {
      setErr(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 520, margin: "0 auto", padding: "28px 16px 48px" }}>
        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 900 }}>Admin Login</h1>
        <p style={{ color: "#444", marginTop: 10, lineHeight: 1.6 }}>
          Sign in to update fuel prices and store info.
        </p>

        <form
          onSubmit={onSubmit}
          style={{ marginTop: 16, border: "1px solid #eee", borderRadius: 16, padding: 16, background: "white" }}
        >
          <label style={labelStyle}>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required style={inputStyle} />

          <label style={{ ...labelStyle, marginTop: 12 }}>Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required style={inputStyle} />

          {err && <div style={{ marginTop: 12, color: "#b00", whiteSpace: "pre-wrap" }}>{err}</div>}

          <button
            disabled={loading}
            type="submit"
            style={{
              marginTop: 14,
              width: "100%",
              border: "none",
              borderRadius: 12,
              padding: "12px 14px",
              background: "#111",
              color: "white",
              fontWeight: 900,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </main>
    </>
  );
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 900, color: "#111" };

const inputStyle: React.CSSProperties = {
  marginTop: 6,
  width: "100%",
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #ddd",
  outline: "none",
  fontSize: 14,
};
