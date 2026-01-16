import { Suspense } from "react";
import InventoryClient from "./InventoryClient";

export default function InventoryPage() {
  return (
    <Suspense fallback={<div style={{ padding: 16 }}>Loading…</div>}>
      <InventoryClient />
    </Suspense>
  );
}
