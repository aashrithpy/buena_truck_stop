import { Suspense } from "react";
import AdminInventoryClient from "./AdminInventoryClient";

export default function AdminInventoryPage() {
  return (
    <Suspense fallback={<div style={{ padding: 16 }}>Loading…</div>}>
      <AdminInventoryClient />
    </Suspense>
  );
}
