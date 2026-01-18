"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

type CustomerProfile = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  receipts: string[] | null;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function CustomerAccountClient() {
  const router = useRouter();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("customer_access_token");
    if (!token) {
      router.push("/customer/login");
      return;
    }

    async function load() {
      try {
        const res = await fetch(`${API_URL}/customers/me`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        setProfile(data);
      } catch (e: any) {
        setErr(e?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [router]);

  function logout() {
    localStorage.removeItem("customer_access_token");
    router.push("/customer/login");
  }

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px 60px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 10 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 900 }}>My Account</h1>
            <p style={{ color: "#555", lineHeight: 1.6 }}>Review your details and receipts below.</p>
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

        {loading && <div style={{ marginTop: 16, color: "#666" }}>Loading…</div>}
        {err && <div style={{ marginTop: 16, color: "#b00" }}>{err}</div>}

        {profile && (
          <section style={{ marginTop: 16, border: "1px solid #eee", borderRadius: 16, padding: 16, background: "white" }}>
            <div style={{ fontWeight: 900, fontSize: 18 }}>{profile.name}</div>
            <div style={{ marginTop: 8, color: "#555" }}>{profile.email}</div>
            {profile.phone && <div style={{ marginTop: 6, color: "#555" }}>📞 {profile.phone}</div>}
            {profile.address && <div style={{ marginTop: 6, color: "#555" }}>🏠 {profile.address}</div>}

            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 900 }}>Receipts</div>
              {profile.receipts && profile.receipts.length > 0 ? (
                <ul style={{ margin: "6px 0 0", paddingLeft: 18, color: "#555", fontSize: 14 }}>
                  {profile.receipts.map((r, idx) => (
                    <li key={`${profile.id}-${idx}`}>{r}</li>
                  ))}
                </ul>
              ) : (
                <div style={{ marginTop: 6, color: "#777", fontSize: 13 }}>No receipts listed yet.</div>
              )}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
