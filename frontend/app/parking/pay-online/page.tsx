import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function ParkingPayOnlinePage() {
  return (
    <>
      <Navbar />
      <section style={{ padding: "64px 0", background: "var(--off-white)" }}>
        <div className="container" style={{ display: "grid", gap: 16, maxWidth: 760 }}>
          <h1 className="h1">Online Payments Coming Soon</h1>
          <p className="p">
            We are preparing a secure payment portal for parking reservations. Please reserve your spot now and
            complete payment at the truck stop when you arrive.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link className="btnPrimary" href="/parking">
              Back to Parking
            </Link>
            <Link className="btnSecondary" href="/">
              Return Home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
