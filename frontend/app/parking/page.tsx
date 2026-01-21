import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const heroWrap: React.CSSProperties = {
  position: "relative",
  height: "70vh",
  minHeight: 480,
};

const overlay: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.75) 100%)",
};

const heroContent: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "flex-end",
};

const heroPill: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "8px 12px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.12)",
  color: "white",
  border: "1px solid rgba(255,255,255,0.3)",
  fontFamily: "Oswald, sans-serif",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  fontSize: 12,
};

const cardWrap: React.CSSProperties = {
  padding: 20,
  display: "grid",
  gap: 12,
};

const fieldStyle: React.CSSProperties = {
  display: "grid",
  gap: 6,
};

const inputStyle: React.CSSProperties = {
  borderRadius: 10,
  border: "1px solid var(--border)",
  padding: "10px 12px",
  fontSize: 14,
  fontFamily: "inherit",
};

export default function ParkingPage() {
  return (
    <>
      <Navbar />

      <section style={{ position: "relative" }}>
        <div style={heroWrap}>
          <Image src="/photos/parking-hero.png" alt="Truck stop parking area" fill priority style={{ objectFit: "cover" }} />
          <div style={overlay} />
          <div style={heroContent}>
            <div className="container" style={{ paddingBottom: 36 }}>
              <h1 className="h1" style={{ color: "white" }}>
                Truck Parking
              </h1>
              <p className="p" style={{ color: "rgba(255,255,255,0.9)", maxWidth: 720 }}>
                Reserve your spot at Buena Truck Stop and park with confidence. Parking is only $15 per day and
                available 24/7 for early arrivals.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
                <span style={heroPill}>$15 / Day</span>
                <span style={heroPill}>Spots Held Until 10 PM</span>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
                <a className="btnPrimary" href="#reserve">
                  Book a Spot
                </a>
                <a className="btnSecondary" href="#track">
                  Track Payment
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="reserve" style={{ padding: "48px 0", background: "var(--off-white)" }}>
        <div className="container" style={{ display: "grid", gap: 24 }}>
          <div style={{ display: "grid", gap: 10 }}>
            <h2 className="h2">Book Your Parking Spot</h2>
            <p className="p">
              Fill in the details below to reserve your parking. We will provide a tracking ID to confirm your
              spot. Payment can be completed on arrival or online.
            </p>
          </div>

          <div className="grid3" style={{ alignItems: "stretch" }}>
            <div className="card" style={cardWrap}>
              <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 16, fontWeight: 600 }}>
                Reservation Details
              </div>
              <label style={fieldStyle}>
                <span>Name</span>
                <input type="text" placeholder="Driver or fleet contact" style={inputStyle} />
              </label>
              <label style={fieldStyle}>
                <span>Phone Number</span>
                <input type="tel" placeholder="(555) 123-4567" style={inputStyle} />
              </label>
              <label style={fieldStyle}>
                <span>Arrival Date</span>
                <input type="date" style={inputStyle} />
              </label>
              <label style={fieldStyle}>
                <span>Number of Days</span>
                <input type="number" min={1} max={30} placeholder="1" style={inputStyle} />
              </label>
              <label style={fieldStyle}>
                <span>Truck Number (optional)</span>
                <input type="text" placeholder="Unit or trailer #" style={inputStyle} />
              </label>
              <button className="btnPrimary" type="button">
                Get Tracking ID
              </button>
            </div>

            <div className="card" style={cardWrap}>
              <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 16, fontWeight: 600 }}>Payment Options</div>
              <p className="p" style={{ marginTop: 0 }}>
                Choose how you want to pay for parking. Online payments will redirect you to our payment portal
                once it is available.
              </p>
              <div style={{ display: "grid", gap: 12 }}>
                <div style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 12 }}>
                  <div style={{ fontWeight: 600 }}>Pay on Arrival</div>
                  <p className="p" style={{ marginTop: 6 }}>
                    Check in at the front desk when you arrive. We accept cash and major cards on-site.
                  </p>
                </div>
                <div style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 12 }}>
                  <div style={{ fontWeight: 600 }}>Pay Online (Coming Soon)</div>
                  <p className="p" style={{ marginTop: 6 }}>
                    Reserve now and complete payment online when the portal launches.
                  </p>
                  <Link className="btnSecondary" href="/parking/pay-online">
                    Go to Online Payment
                  </Link>
                </div>
              </div>
            </div>

            <div className="card" style={cardWrap}>
              <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 16, fontWeight: 600 }}>Pricing Summary</div>
              <div style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 20 }}>$15 / day</div>
                <p className="p" style={{ marginTop: 6 }}>
                  All reservations include access to restrooms, lighting, and 24/7 monitored lot access.
                </p>
              </div>
              <div style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 12 }}>
                <div style={{ fontWeight: 600 }}>Need help?</div>
                <p className="p" style={{ marginTop: 6 }}>
                  Call us at (856) 697-3887 for fleet pricing or long-term parking requests.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="track" style={{ padding: "48px 0" }}>
        <div className="container" style={{ display: "grid", gap: 20 }}>
          <div>
            <h2 className="h2">Track Your Payment</h2>
            <p className="p">
              Enter your tracking ID to confirm payment status or update your reservation details.
            </p>
          </div>
          <div className="card" style={{ padding: 20, display: "grid", gap: 12, maxWidth: 560 }}>
            <label style={fieldStyle}>
              <span>Tracking ID</span>
              <input type="text" placeholder="e.g. BTF-2048" style={inputStyle} />
            </label>
            <button className="btnPrimary" type="button">
              Track Payment
            </button>
            <p className="p" style={{ marginTop: 0 }}>
              Need assistance? Visit the service desk or call ahead and we will locate your reservation.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
