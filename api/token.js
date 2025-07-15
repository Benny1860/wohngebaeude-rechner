export default async function handler(req, res) {
  const response = await fetch("https://wohngebaeude-api.softfair-server.de/api/v1/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: bstrixner,
      password: bstrixner1
    }),
  });

  if (!response.ok) {
    return res.status(401).json({ error: "Authentifizierung fehlgeschlagen" });
  }

  const data = await response.json();
  res.status(200).json({ token: data.token });
}
