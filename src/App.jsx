import { useState } from "react";

export default function App() {
  const [form, setForm] = useState({
    plz: "", ort: "", wohnflaeche: "", baujahr: "",
    dachform: "", bauweise: "", heizung: "",
    gebaeudetyp: "", nutzung: "", vorschaden: "nein", zustand: ""
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
        wohnort: { plz: form.plz, ort: form.ort },
        wohnflaecheQm: Number(form.wohnflaeche),
        baujahr: form.baujahr,
        dachart: form.dachform,
        bauweise: form.bauweise,
        heizungsart: form.heizung,
        nutzungsart: form.nutzung,
        gebaeudetyp: form.gebaeudetyp,
        vorschaden: form.vorschaden === "ja"
      })
    });

    const data = await res.json();
    setResults(data.angebote || []);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", fontFamily: "Arial", padding: 16 }}>
      <h1>Wohngebäude-Rechner</h1>
      {[
        ["plz", "PLZ"], ["ort", "Ort"], ["wohnflaeche", "Wohnfläche (m²)"],
        ["baujahr", "Baujahr"], ["dachform", "Dachform"], ["bauweise", "Bauweise"],
        ["heizung", "Heizungsart"], ["gebaeudetyp", "Gebäudetyp"],
        ["nutzung", "Nutzung (Selbst/vermietet)"], ["zustand", "Zustand (Neubau/Bestand)"]
      ].map(([name, label]) => (
        <div key={name} style={{ marginBottom: 10 }}>
          <label style={{ display: "block", fontWeight: "bold" }}>{label}</label>
          <input type="text" name={name} value={form[name]} onChange={handleChange} style={{ width: "100%", padding: 8 }} />
        </div>
      ))}
      <div style={{ marginBottom: 10 }}>
        <label style={{ fontWeight: "bold" }}>Gab es Vorschäden?</label>
        <select name="vorschaden" value={form.vorschaden} onChange={handleChange} style={{ width: "100%", padding: 8 }}>
          <option value="nein">Nein</option>
          <option value="ja">Ja</option>
        </select>
      </div>
      <button onClick={submit} disabled={loading} style={{ padding: "10px 20px" }}>
        {loading ? "Lade..." : "Vergleich starten"}
      </button>

      {results.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h2>Vergleichsergebnisse</h2>
          {results.map((r, i) => (
            <div key={i} style={{ border: "1px solid #ccc", marginBottom: 10, padding: 10 }}>
              <strong>{r.gesellschaft}</strong><br />
              Tarif: {r.tarifName}<br />
              Beitrag: {r.beitragJaehrlich} €/Jahr<br />
              <button>Jetzt beantragen</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}