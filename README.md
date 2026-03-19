# ProzessFlow24 Landingpage

Statische Landingpage in reinem HTML, CSS und JavaScript für die strukturierte Erstaufnahme in Notariaten.

## Lokal prüfen

Da das Projekt keine Build-Pipeline benötigt, reicht ein statischer Webserver:

```bash
python3 -m http.server 4173
```

Danach ist die Seite unter `http://127.0.0.1:4173` erreichbar.

## Deployment mit Vercel

Für diese Landingpage ist **kein Build-Schritt nötig**. Die Datei `vercel.json` setzt das Projekt explizit auf das Framework-Preset **Other**, überspringt Installation und Build und liefert die Dateien direkt aus dem Repository-Root aus.

### Empfohlene Vercel-Einstellungen

1. Repository bei Vercel importieren.
2. Als Root Directory das Repository selbst verwenden.
3. Falls im Dashboard Overrides aktiv sind:
   - **Framework Preset:** `Other`
   - **Build Command:** leer lassen
   - **Output Directory:** `.`
4. Deploy starten.

Zusätzlich sorgt die Rewrite-Regel dafür, dass Anfragen an nicht-dateibasierte Pfade auf `index.html` zurückfallen, statt mit einer 404 zu enden.
