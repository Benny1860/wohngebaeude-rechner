import { useState } from "react";

export default function App() {
  const [form, setForm] = useState({ zipCode: "", livingSpace: "" });
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculate = () => {
    setLoading(true);
    setTimeout(() => {
      setOffers([
        {
          offerId: "demo1",
          company: "Beispielfair",
          rate: "Premium Plus",
          coverages: ["Feuer", "Wasser", "Sturm"],
          premium: 489,
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={{ fontFamily: "Arial", maxWidth: 600, margin: "0 auto", padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#1e3a8a", marginBottom: 16 }}>
        Wohngebäude-Rechner
      </h1>
      <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 16, marginBottom: 16 }}>
        <input
          name="zipCode"
          placeholder="PLZ"
          value={form.zipCode}
          onChange={handleChange}
          style={{ width: "100%", padding: 8, marginBottom: 12, border: "1px solid #ccc", borderRadius: 4 }}
        />
        <input
          name="livingSpace"
          type="number"
          placeholder="Wohnfläche (m²)"
          value={form.livingSpace}
          onChange={handleChange}
          style={{ width: "100%", padding: 8, marginBottom: 12, border: "1px solid #ccc", borderRadius: 4 }}
        />
        <button
          onClick={calculate}
          disabled={loading}
          style={{
            padding: "8px 16px",
            backgroundColor: "#2563EB",
            color: "#fff",
            border: "none",
            borderRadius: 4,
          }}
        >
          {loading ? "Lade..." : "Beitrag berechnen"}
        </button>
      </div>

      {offers.map((offer) => (
        <div key={offer.offerId} style={{ border: "1px solid #ccc", borderRadius: 8, padding: 16 }}>
          <h2 style={{ fontWeight: "bold", color: "#1d4ed8" }}>{offer.company}</h2>
          <p>Tarif: {offer.rate}</p>
          <p>Leistungen: {offer.coverages.join(", ")}</p>
          <p style={{ fontWeight: "bold", fontSize: 18 }}>{offer.premium} € / Jahr</p>
          <button style={{ marginTop: 8, padding: "8px 16px", backgroundColor: "#15803d", color: "#fff", border: "none", borderRadius: 4 }}>
            Online beantragen
          </button>
        </div>
      ))}
    </div>
  );
}