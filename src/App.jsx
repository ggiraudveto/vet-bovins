import { useState, useRef, useCallback } from "react";

const ACCENT = "#2d6a4f";
const ACCENT2 = "#52b788";
const WARN = "#e76f51";
const BG = "#f8f5f0";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Source+Sans+3:wght@400;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Source Sans 3', sans-serif; background: ${BG}; min-height: 100vh; }
  .app { max-width: 960px; margin: 0 auto; padding: 24px 16px 60px; }
  .header { display: flex; align-items: center; gap: 14px; margin-bottom: 32px; border-bottom: 2px solid ${ACCENT}; padding-bottom: 16px; }
  .header-icon { font-size: 2.4rem; }
  .header h1 { font-family: 'Playfair Display', serif; font-size: 1.7rem; color: ${ACCENT}; line-height: 1.1; }
  .header p { font-size: 0.85rem; color: #666; margin-top: 2px; }
  .drop-zone { border: 2.5px dashed ${ACCENT2}; border-radius: 16px; background: #edf7f0; padding: 40px 20px; text-align: center; cursor: pointer; transition: all .2s; position: relative; margin-bottom: 20px; }
  .drop-zone:hover, .drop-zone.drag { background: #d8f3dc; border-color: ${ACCENT}; }
  .drop-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; }
  .drop-icon { font-size: 2.5rem; margin-bottom: 10px; }
  .drop-zone h2 { font-size: 1.1rem; color: ${ACCENT}; font-weight: 600; margin-bottom: 6px; }
  .drop-zone p { font-size: 0.85rem; color: #777; }
  .preview-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; margin-bottom: 20px; }
  .preview-item { border-radius: 10px; overflow: hidden; position: relative; border: 2px solid #ddd; background: #fff; }
  .preview-item img { width: 100%; height: 100px; object-fit: cover; display: block; }
  .preview-item .remove { position: absolute; top: 4px; right: 4px; background: rgba(0,0,0,.55); color: #fff; border: none; border-radius: 50%; width: 22px; height: 22px; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; }
  .preview-item .label { font-size: 0.7rem; padding: 4px 6px; color: #444; background: #f5f5f5; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 22px; border-radius: 8px; font-family: 'Source Sans 3', sans-serif; font-size: 0.95rem; font-weight: 600; cursor: pointer; border: none; transition: all .18s; }
  .btn-primary { background: ${ACCENT}; color: #fff; }
  .btn-primary:hover { background: #1b4332; }
  .btn-primary:disabled { background: #aaa; cursor: not-allowed; }
  .btn-secondary { background: #fff; color: ${ACCENT}; border: 2px solid ${ACCENT}; }
  .btn-secondary:hover { background: #edf7f0; }
  .btn-danger { background: ${WARN}; color: #fff; }
  .btn-danger:hover { background: #c1440e; }
  .actions { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 24px; }
  .progress-bar { height: 6px; background: #ddd; border-radius: 3px; margin-bottom: 20px; overflow: hidden; }
  .progress-fill { height: 100%; background: ${ACCENT2}; border-radius: 3px; transition: width .4s; }
  .status-msg { text-align: center; font-size: 0.9rem; color: #555; margin-bottom: 16px; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .spinner { width: 18px; height: 18px; border: 2px solid #ccc; border-top-color: ${ACCENT}; border-radius: 50%; animation: spin .7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .results-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .results-header h2 { font-family: 'Playfair Display', serif; font-size: 1.2rem; color: ${ACCENT}; }
  .badge { background: ${ACCENT}; color: #fff; border-radius: 20px; padding: 2px 12px; font-size: 0.8rem; font-weight: 600; }
  .table-wrap { overflow-x: auto; border-radius: 12px; border: 1px solid #ddd; margin-bottom: 20px; }
  table { width: 100%; border-collapse: collapse; background: #fff; }
  thead { background: ${ACCENT}; color: #fff; }
  thead th { padding: 10px 14px; text-align: left; font-size: 0.85rem; font-weight: 600; }
  tbody tr { border-bottom: 1px solid #eee; transition: background .15s; }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: #f0faf4; }
  td { padding: 9px 14px; font-size: 0.88rem; color: #333; vertical-align: middle; }
  td input { border: 1px solid #ccc; border-radius: 6px; padding: 4px 8px; font-size: 0.85rem; width: 100%; font-family: monospace; }
  td input:focus { outline: 2px solid ${ACCENT2}; border-color: transparent; }
  .sex-badge { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 0.78rem; font-weight: 700; }
  .sex-M { background: #cff4fc; color: #0c5460; }
  .sex-F { background: #fce4ec; color: #880e4f; }
  .export-row { display: flex; gap: 10px; flex-wrap: wrap; }
  .error-box { background: #fff0ed; border: 1px solid ${WARN}; border-radius: 10px; padding: 12px 16px; color: ${WARN}; font-size: 0.88rem; margin-bottom: 16px; }
  .empty-state { text-align: center; padding: 40px 20px; color: #aaa; border: 1px dashed #ddd; border-radius: 12px; background: #fafafa; }
  .empty-state .icon { font-size: 3rem; margin-bottom: 10px; }
  .row-del { background: none; border: none; cursor: pointer; color: #bbb; font-size: 1rem; transition: color .15s; }
  .row-del:hover { color: ${WARN}; }
`;

function toBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result.split(",")[1]);
    r.onerror = () => rej(new Error("Lecture échouée"));
    r.readAsDataURL(file);
  });
}

function generateCSV(rows) {
  const header = "N° National;N° Travail;Sexe;Race;Date Naissance;N° Mère\n";
  const body = rows.map((r) =>
    `${r.numNational};${r.numTravail};${r.sexe};${r.race};${r.dateNaissance};${r.numMere || ""}`
  ).join("\n");
  return header + body;
}

function downloadFile(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function generatePDFContent(rows) {
  const date = new Date().toLocaleDateString("fr-FR");
  const rowsHTML = rows.map((r, i) => `
    <tr style="background:${i % 2 === 0 ? "#f8fffe" : "#fff"}">
      <td>${i + 1}</td>
      <td><strong>${r.numNational}</strong></td>
      <td>${r.numTravail}</td>
      <td>${r.sexe === "M" ? "♂ Mâle" : "♀ Femelle"}</td>
      <td>${r.race}</td>
      <td>${r.dateNaissance}</td>
      <td style="font-size:11px">${r.numMere || "—"}</td>
    </tr>`).join("");
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">
<style>
  body { font-family: Arial, sans-serif; margin: 0; padding: 0; color: #222; }
  .cover { background: #2d6a4f; color: #fff; padding: 48px 40px 36px; }
  .cover h1 { font-size: 2rem; margin-bottom: 6px; }
  .cover p { font-size: 0.95rem; opacity: .8; }
  .body { padding: 32px 40px; }
  .meta { display: flex; gap: 32px; margin-bottom: 28px; font-size: 0.88rem; color: #555; border-bottom: 2px solid #2d6a4f; padding-bottom: 14px; }
  .meta strong { display: block; font-size: 1.1rem; color: #2d6a4f; }
  table { width: 100%; border-collapse: collapse; }
  thead { background: #2d6a4f; color: #fff; }
  th { padding: 9px 10px; text-align: left; font-size: 0.82rem; }
  td { padding: 8px 10px; font-size: 0.84rem; border-bottom: 1px solid #eee; }
  .footer { margin-top: 40px; font-size: 0.78rem; color: #aaa; text-align: center; border-top: 1px solid #eee; padding-top: 14px; }
</style></head><body>
<div class="cover"><h1>🐄 Registre Bovins</h1><p>Identification des animaux — Passeports scannés</p></div>
<div class="body">
  <div class="meta">
    <div><strong>${rows.length}</strong> animaux identifiés</div>
    <div><strong>${date}</strong> Date d'édition</div>
  </div>
  <table>
    <thead><tr><th>#</th><th>N° National</th><th>N° Travail</th><th>Sexe</th><th>Race</th><th>Date Naiss.</th><th>N° Mère</th></tr></thead>
    <tbody>${rowsHTML}</tbody>
  </table>
  <div class="footer">Document généré automatiquement • VetScan Bovins • ${date}</div>
</div></body></html>`;
}

export default function App() {
  const [images, setImages] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);
  const inputRef = useRef();

  const addFiles = useCallback((files) => {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    setImages((prev) => [...prev, ...arr.map((f) => ({ file: f, url: URL.createObjectURL(f), name: f.name }))]);
  }, []);

  const removeImage = (i) => {
    setImages((prev) => { URL.revokeObjectURL(prev[i].url); return prev.filter((_, idx) => idx !== i); });
  };

  const analyze = async () => {
    if (!images.length) return;
    setLoading(true); setError(""); setRows([]); setProgress(0);
    setStatusMsg("Préparation des images…");

    try {
      const imagePayloads = await Promise.all(
        images.map(async (img) => ({
          base64: await toBase64(img.file),
          mediaType: img.file.type || "image/jpeg",
          name: img.name,
        }))
      );

      setStatusMsg(`Analyse de ${images.length} image(s) en cours…`);
      setProgress(30);

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: imagePayloads }),
      });

      setProgress(80);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erreur serveur");

      setRows(data.bovins);
      setProgress(100);
      setStatusMsg(`✓ ${data.bovins.length} bovin(s) identifié(s)`);
    } catch (e) {
      setError(`Erreur : ${e.message}`);
    }
    setLoading(false);
  };

  const updateRow = (i, field, val) => setRows((prev) => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  const deleteRow = (i) => setRows((prev) => prev.filter((_, idx) => idx !== i));
  const exportCSV = () => downloadFile("\uFEFF" + generateCSV(rows), "bovins_identification.csv", "text/csv;charset=utf-8");
  const exportPDF = () => { const win = window.open("", "_blank"); win.document.write(generatePDFContent(rows)); win.document.close(); setTimeout(() => win.print(), 600); };

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="header">
          <div className="header-icon">🐄</div>
          <div>
            <h1>VetScan Bovins</h1>
            <p>Extraction automatique des identifications — Passeports cerfa</p>
          </div>
        </div>

        <div className={`drop-zone${drag ? " drag" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
          onClick={() => inputRef.current?.click()}>
          <input ref={inputRef} type="file" accept="image/*" multiple onChange={(e) => addFiles(e.target.files)} onClick={(e) => e.stopPropagation()} />
          <div className="drop-icon">📷</div>
          <h2>Déposer les photos de passeports ici</h2>
          <p>ou cliquer pour sélectionner — plusieurs images acceptées</p>
        </div>

        {images.length > 0 && (
          <div className="preview-grid">
            {images.map((img, i) => (
              <div className="preview-item" key={i}>
                <img src={img.url} alt={img.name} />
                <button className="remove" onClick={() => removeImage(i)}>×</button>
                <div className="label">{img.name}</div>
              </div>
            ))}
          </div>
        )}

        <div className="actions">
          <button className="btn btn-primary" onClick={analyze} disabled={loading || images.length === 0}>
            {loading ? <><span className="spinner" /> Analyse en cours…</> : "🔍 Analyser les photos"}
          </button>
          {images.length > 0 && (
            <button className="btn btn-danger" onClick={() => { setImages([]); setRows([]); setStatusMsg(""); setError(""); }}>
              🗑 Tout effacer
            </button>
          )}
        </div>

        {loading && <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>}
        {statusMsg && !loading && <div className="status-msg">✅ {statusMsg}</div>}
        {loading && <div className="status-msg"><span className="spinner" /> {statusMsg}</div>}
        {error && <div className="error-box">⚠️ {error}</div>}

        {rows.length > 0 && (
          <div>
            <div className="results-header">
              <h2>Bovins identifiés</h2>
              <span className="badge">{rows.length} animal{rows.length > 1 ? "ux" : ""}</span>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>#</th><th>N° National</th><th>N° Travail</th><th>Sexe</th><th>Race</th><th>Date Naiss.</th><th>N° Mère</th><th></th></tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i}>
                      <td style={{ color: "#aaa", fontSize: "0.8rem" }}>{i + 1}</td>
                      <td><input value={r.numNational || ""} onChange={(e) => updateRow(i, "numNational", e.target.value)} /></td>
                      <td><input value={r.numTravail || ""} onChange={(e) => updateRow(i, "numTravail", e.target.value)} style={{ width: 70 }} /></td>
                      <td><span className={`sex-badge sex-${r.sexe}`}>{r.sexe === "M" ? "♂ M" : "♀ F"}</span></td>
                      <td>{r.race}</td>
                      <td><input value={r.dateNaissance || ""} onChange={(e) => updateRow(i, "dateNaissance", e.target.value)} style={{ width: 110 }} /></td>
                      <td style={{ fontSize: "0.78rem", color: "#888" }}>{r.numMere || "—"}</td>
                      <td><button className="row-del" onClick={() => deleteRow(i)}>🗑</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="export-row">
              <button className="btn btn-primary" onClick={exportCSV}>📊 Exporter Excel (CSV)</button>
              <button className="btn btn-secondary" onClick={exportPDF}>📄 Générer PDF</button>
            </div>
          </div>
        )}

        {!loading && rows.length === 0 && images.length === 0 && (
          <div className="empty-state">
            <div className="icon">📋</div>
            <p>Importez des photos de passeports bovins pour commencer l'identification</p>
          </div>
        )}
      </div>
    </>
  );
}
