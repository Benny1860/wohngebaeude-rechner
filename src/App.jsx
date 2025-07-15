import { useState } from "react";

export default function App() {
  const [form, setForm] = useState({
    zip: "",
    city: "",
    year: "",
    area: "",
    roof: "",
    heating: "",
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    setLoading(true);
    const tokenRes = await fetch("/api/token");
    const { token } = await tokenRes.json();

    const res = await fetch("https://wohngebaeude-api.softfair-server.de/api/v1/angebote", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        versicherungsbeginn: new Date().toISOString().split("T")[0],
        wohnort: {
          plz: form.zip,
          ort: form.city
        },
        wohnflaecheQm: Number(form.area),
        baujahr: form.year,
        dachart: form.roof,
        heizungsart: form.heating
      })
    });

    const data = await res.json();
    setResults(data.angebote || []);
    setLoading(false);
  };

  return (
    <div style={{ padding: 16, maxWidth: 600, margin: "0 auto", fontFamily: "Arial" }}>
      <h1>Wohngebäude-Rechner</h1>
      <input name="zip" placeholder="PLZ" value={form.zip} onChange={handleChange} /><br />
      <input name="city" placeholder="Ort" value={form.city} onChange={handleChange} /><br />
      <input name="year" placeholder="Baujahr" value={form.year} onChange={handleChange} /><br />
      <input name="area" placeholder="Wohnfläche m²" value={form.area} onChange={handleChange} /><br />
      <input name="roof" placeholder="Dachform" value={form.roof} onChange={handleChange} /><br />
      <input name="heating" placeholder="Heizungsart" value={form.heating} onChange={handleChange} /><br />
      <button onClick={submit} disabled={loading}>
        {loading ? "Lade..." : "Berechnen"}
      </button>

      {results.map((r, i) => (
        <div key={i} style={{ border: "1px solid #ccc", padding: 12, marginTop: 12 }}>
          <h3>{r.gesellschaft}</h3>
          <p>Tarif: {r.tarifName}</p>
          <p>Beitrag: {r.beitragJaehrlich} € / Jahr</p>
          <button>Jetzt beantragen</button>
        </div>
      ))}
    </div>
  );
}