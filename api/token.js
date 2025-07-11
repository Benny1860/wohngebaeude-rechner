export default async function handler(req, res) {
  const username = process.env.SOFTFAIR_USERNAME;
  const password = process.env.SOFTFAIR_PASSWORD;

  const response = await fetch("https://wohngebaeude-api.softfair-server.de/api/v1/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    return res.status(401).json({ error: "Token konnte nicht abgerufen werden" });
  }

  const data = await response.json();
  res.status(200).json({ token: data.token });
}