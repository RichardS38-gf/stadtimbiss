# bilder-umwandeln.ps1 — Anaar
#
# Wandelt alle PNG-Bilder im Ordner Bilder in WebP um und verkleinert
# sie dabei auf die Groesse, in der sie tatsaechlich angezeigt werden.
# Die Originale bleiben unberuehrt, das Ergebnis landet in Bilder-webp.
#
# Voraussetzung: ImageMagick. Einmalig installieren mit
#   winget install ImageMagick.ImageMagick
# Danach ein neues PowerShell-Fenster oeffnen, damit magick im Pfad ist.
#
# Aufruf aus dem Indisch-Ordner heraus:
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
  # Logo mit Schriftzug. Groesste Verwendung ist der Hero mit
  # bis zu 420px Breite.
  'logo'             = 900

  # Hero. Formatfuellendes Hintergrundbild ueber die ganze
  # Fensterbreite. 2400 deckt auch breite Monitore ab; 3840 fuer
  # doppelte Punktdichte waere kaum sichtbar, kostet aber viel
  # Ladezeit.
  'hero2'            = 2400

  # Bild auf der Reservierungsseite, bis 620px breit
  'reservieren'      = 1300

  # Lehmofen in der Tandoor-Sektion, bis 540px breit
  'tandoor'          = 1100

  # Die zwei versetzten Bilder in der Ueber-uns-Sektion,
  # Hochformat 3:4, bis 380px breit angezeigt
  'ueberuns'         = 800
  'ueberuns2'        = 800

  # Kategoriebilder auf der Startseite, quadratisch, in den
  # Wechselzeilen bis 560px breit
  'kat-vorspeisen'   = 1100
  'kat-tandoor'      = 1100
  'kat-currys'       = 1100
  'kat-vegetarisch'  = 1100
}

# Alles, was hier nicht steht, ist ein Gerichtbild der Karte.
# Anzeige bis 360px breit im Hochformat, also 720px Zielbreite.
$standardBreite = 720

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
