import { useState } from "react";

export default function App() {
  const [form, setForm] = useState({
    plz: "", ort: "", wohnflaeche: "", baujahr: "",
    dachform: "", bauweise: "", heizung: "",
    gebaeudetyp: "", nutzung: "", vorschaden: "nein", zustand: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const tooltips = {
    plz: "Postleitzahl des versicherten Objekts.",
    ort: "Ort, in dem das versicherte Gebäude steht.",
    wohnflaeche: "Gesamte Wohnfläche in Quadratmetern (inkl. ausgebautem Dachgeschoss).",
    baujahr: "Jahr der ursprünglichen Errichtung des Gebäudes.",
    dachform: "Form des Daches, z. B. Satteldach oder Flachdach.",
    bauweise: "Konstruktionsart des Gebäudes – relevant für das Risiko.",
    heizung: "Primäre Heizungsart des Gebäudes.",
    gebaeudetyp: "Art des Gebäudes, z. B. freistehend oder Doppelhaushälfte.",
    nutzung: "Wie wird das Gebäude genutzt? Eigennutzung oder Vermietung.",
    zustand: "Befindet sich das Gebäude im Bau (Neubau) oder im Bestand?",
    vorschaden: "Gab es in den letzten Jahren relevante Schäden?"
  };

  const dropdowns = {
    dachform: ["Satteldach", "Flachdach", "Walmdach", "Pultdach", "Mansarddach", "Zeltdach"],
    bauweise: ["Massivbauweise", "Holzständerbauweise", "Fertigbauweise", "Mischbauweise"],
    heizung: ["Zentralheizung", "Gasheizung", "Ölheizung", "Fernwärme", "Wärmepumpe", "Pelletheizung"],
    gebaeudetyp: ["Freistehend", "Doppelhaushälfte", "Reihenmittelhaus", "Reihenendhaus", "Mehrfamilienhaus"],
    nutzung: ["Selbst genutzt", "Vermietet"],
    zustand: ["Neubau", "Bestand"]
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      if (!form[key]) {
        newErrors[key] = "Pflichtfeld";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    const tokenRes = await fetch("/api/token");
    const { token } = await tokenRes.json();

    const res = await fetch("https://wohngebaeude-api.softfair-server.de/api/v1/angebote", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "ConsumerKey": "d4b25db0-184f-4098-bb7f-89088835f6ba",
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

  const renderError = (key) => (
    errors[key] && <div style={{ color: "red", fontSize: 12 }}>{errors[key]}</div>
  );

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", fontFamily: "Arial", padding: 16 }}>
      <h1>Wohngebäude-Rechner</h1>

      {["plz", "ort", "wohnflaeche", "baujahr"].map((name) => (
        <div key={name} style={{ marginBottom: 10 }}>
          <label style={{ display: "block", fontWeight: "bold" }} title={tooltips[name]}>
            {name.toUpperCase()}
          </label>
          <input
            type="text"
            name={name}
            value={form[name]}
            onChange={handleChange}
            style={{ width: "100%", padding: 8, borderColor: errors[name] ? "red" : "#ccc" }}
          />
          {renderError(name)}
        </div>
      ))}

      {Object.entries(dropdowns).map(([name, options]) => (
        <div key={name} style={{ marginBottom: 10 }}>
          <label style={{ display: "block", fontWeight: "bold" }} title={tooltips[name]}>
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </label>
          <select
            name={name}
            value={form[name]}
            onChange={handleChange}
            style={{ width: "100%", padding: 8, borderColor: errors[name] ? "red" : "#ccc" }}
          >
            <option value="">Bitte wählen</option>
            {options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {renderError(name)}
        </div>
      ))}

      <div style={{ marginBottom: 10 }}>
        <label style={{ fontWeight: "bold" }} title={tooltips.vorschaden}>Gab es Vorschäden?</label>
        <select
          name="vorschaden"
          value={form.vorschaden}
          onChange={handleChange}
          style={{ width: "100%", padding: 8 }}
        >
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