# bilder-umwandeln.ps1 — Sabai Sabai
#
# Wandelt alle PNG-Bilder im Ordner Bilder in WebP um und verkleinert
# sie dabei auf die Groesse, in der sie tatsaechlich angezeigt werden.
# Die Originale bleiben unberuehrt, das Ergebnis landet in Bilder-webp.
#
# Voraussetzung: ImageMagick. Einmalig installieren mit
#   winget install ImageMagick.ImageMagick
# Danach ein neues PowerShell-Fenster oeffnen, damit magick im Pfad ist.
#
# Aufruf aus dem Thai-Ordner heraus:
#   .\bilder-umwandeln.ps1

$quelle = Join-Path $PSScriptRoot 'Bilder'
$ziel   = Join-Path $PSScriptRoot 'Bilder-webp'

if (-not (Get-Command magick -ErrorAction SilentlyContinue)) {
  Write-Host 'ImageMagick nicht gefunden.' -ForegroundColor Red
  Write-Host 'Installieren mit:  winget install ImageMagick.ImageMagick'
  Write-Host 'Danach ein NEUES PowerShell-Fenster oeffnen und erneut starten.'
  exit 1
}

New-Item -ItemType Directory -Force -Path $ziel | Out-Null

# Zielbreite je Verwendungszweck. Jeweils etwa doppelt so breit wie die
# Anzeigegroesse, damit es auf Bildschirmen mit hoher Punktdichte scharf
# bleibt. Alles andere waere verschenkte Ladezeit.
$breiten = @{
  # Logo. Groesste Verwendung ist die Fusszeile mit 52px.
  'logo'        = 260

  # Hero. Steht ueber die volle Bildschirmhoehe und wird auf
  # grossen Monitoren bis zu 900px breit angezeigt.
  'hero'        = 1400

  # Bild auf der Reservierungsseite, 340px breit
  'reservieren' = 700

  # Runder Tisch von oben im Abschnitt "Konzept",
  # bis 420px angezeigt
  'rundertisch' = 900

  # Freigestelltes Tuk-Tuk im Werbebanner, bis 660px angezeigt
  'tuktuk_banner' = 1400

  # Kategoriebilder, 320px breit
  'vorspeisen'  = 640
  'suppen'      = 640
  'curry'       = 640
  'ausdemwok'   = 640

  # Zutaten, quadratisch, bis 200px breit
  'galgant'       = 440
  'zitronengras'  = 440
  'limettenblatt' = 440
  'fischsauce'    = 440
  'palmenzucker'  = 440
}

# Alles, was hier nicht steht, ist ein Gerichtbild der Karte.
# Anzeige 108px im Bogen, also 320px Zielbreite.
$standardBreite = 320

$dateien = Get-ChildItem -Path $quelle -Filter *.png
$vorher = 0
$nachher = 0

foreach ($datei in $dateien) {
  $name = [System.IO.Path]::GetFileNameWithoutExtension($datei.Name)
  $breite = if ($breiten.ContainsKey($name)) { $breiten[$name] } else { $standardBreite }
  $ausgabe = Join-Path $ziel "$name.webp"

  # Nur verkleinern, nie hochrechnen. Das Groesserzeichen sorgt dafuer.
  & magick $datei.FullName -resize "${breite}x${breite}>" -quality 80 -strip $ausgabe

  if (Test-Path $ausgabe) {
    $altKB = [math]::Round($datei.Length / 1KB)
    $neuKB = [math]::Round((Get-Item $ausgabe).Length / 1KB)
    $vorher += $datei.Length
    $nachher += (Get-Item $ausgabe).Length
    Write-Host ("{0,-24} {1,7} KB  ->  {2,6} KB" -f $name, $altKB, $neuKB)
  } else {
    Write-Host ("{0,-24} FEHLER" -f $name) -ForegroundColor Red
  }
}

Write-Host ''
Write-Host ('Gesamt: {0} MB  ->  {1} MB' -f `
  [math]::Round($vorher / 1MB, 2), [math]::Round($nachher / 1MB, 2)) -ForegroundColor Green
Write-Host ''
Write-Host 'Ergebnis liegt in Bilder-webp. Pruefe ein paar Bilder,'
Write-Host 'dann den Inhalt nach Bilder kopieren. Die alten PNG-Dateien'
Write-Host 'koennen danach geloescht werden.'
