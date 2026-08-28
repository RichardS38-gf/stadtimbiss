# bilder-umwandeln.ps1 — Café Marlene
#
# Wandelt alle PNG-Bilder im Ordner Bilder in WebP um und verkleinert
# sie dabei auf die Groesse, in der sie tatsaechlich angezeigt werden.
# Die Originale bleiben unberuehrt, das Ergebnis landet in Bilder-webp.
#
# Voraussetzung: ImageMagick. Einmalig installieren mit
#   winget install ImageMagick.ImageMagick
# Danach ein neues PowerShell-Fenster oeffnen, damit magick im Pfad ist.
#
# Aufruf aus dem Bistro-Ordner heraus:
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
  # Foto der Bude im Hero. Wird nur 330px breit angezeigt,
  # 800 reicht auch fuer hohe Punktdichte.
  'hero'        = 800

  # Schichtplan, Bildspalte 300px breit
  'mittag'      = 700
  'nachmittag'  = 700
  'abend'       = 700

  # Altes Foto im Abschnitt Die Bude, 320px breit
  'werkstor'    = 700

  # Werbebanner
  'taxi_banner'       = 900
  'taxiteller_banner' = 500

  'bestellen'   = 1800
  'banner'      = 1800
  'reservieren' = 1400

  # Tageszeiten-Bloecke auf der Startseite
  'fruehstueck' = 1000
  'lunch'       = 1000
  'afterwork'   = 1000

  # Runde Kategoriekacheln, 150px Anzeige
  'kaffee'      = 400
  'kueche'      = 400
  'cocktails'   = 400
  'sueßes'      = 400

  # Freigestellte Deko, bis 400px Anzeige
  'coffee_above'  = 800
  'cocktailabove' = 800

  # Logo, groesste Verwendung 104px in der Fusszeile
  'logo'        = 260
}

# Alles, was hier nicht steht, ist ein Produktbild der Speisekarte.
# Anzeige 120px, also 320px Zielbreite.
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
