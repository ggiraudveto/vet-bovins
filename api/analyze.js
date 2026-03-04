export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { images } = req.body;
  if (!images || !Array.isArray(images)) {
    return res.status(400).json({ error: "Images manquantes" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Clé API non configurée" });
  }

  try {
    const results = [];

    for (const image of images) {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image",
                  source: {
                    type: "base64",
                    media_type: image.mediaType,
                    data: image.base64,
                  },
                },
                {
                  type: "text",
                  text: `Tu regardes une photo de passeport(s) bovin(s) français (cerfa). 
Extrait TOUS les bovins visibles. Pour chaque bovin, retourne un objet JSON.
Réponds UNIQUEMENT avec un tableau JSON valide, sans markdown ni texte autour.

Format attendu:
[
  {
    "numNational": "FR 42 4398 0487",
    "numTravail": "0487",
    "sexe": "M",
    "race": "Charolaise",
    "dateNaissance": "18.09.2025",
    "numMere": "FR42 4352 9023"
  }
]

- numNational: le N° national complet (ex: FR 42 4398 0487)
- numTravail: le N° de travail (4 chiffres, ex: 0487)  
- sexe: M ou F
- race: race bovine
- dateNaissance: date au format JJ.MM.AAAA
- numMere: N° national de la mère si visible, sinon null

Si plusieurs passeports sont visibles, retourne tous les bovins dans le tableau.`,
                },
              ],
            },
          ],
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      const text = data.content?.map((b) => b.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const extracted = JSON.parse(clean);
      results.push(...extracted);
    }

    // Dédoublonnage
    const seen = new Set();
    const deduped = results.filter((r) => {
      if (seen.has(r.numNational)) return false;
      seen.add(r.numNational);
      return true;
    });

    deduped.sort((a, b) => (a.numTravail || "").localeCompare(b.numTravail || ""));

    res.status(200).json({ bovins: deduped });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
