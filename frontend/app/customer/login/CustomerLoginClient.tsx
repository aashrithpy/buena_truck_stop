"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function CustomerLoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/customers/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Login failed");
      }

      const data = await res.json();
      if (!data?.accessToken) throw new Error("Invalid login response");
      localStorage.setItem("customer_access_token", data.accessToken);
      router.push("/customer/account");
    } catch (e: any) {
      setErr(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 620, margin: "0 auto", padding: "32px 16px 60px" }}>
        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 900 }}>Customer Login</h1>
        <p style={{ color: "#555", lineHeight: 1.6 }}>
          Use the credentials provided by the admin to access your receipts and account details.
        </p>

        {err && <div style={{ marginTop: 12, color: "#b00" }}>{err}</div>}

        <form onSubmit={submit} style={{ marginTop: 16, display: "grid", gap: 12 }}>
          <input
            required
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              border: "none",
              borderRadius: 12,
              padding: "12px 16px",
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

const inputStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #ddd",
  width: "100%",
};
