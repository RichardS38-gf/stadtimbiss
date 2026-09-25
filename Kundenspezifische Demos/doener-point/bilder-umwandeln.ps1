# bilder-umwandeln.ps1 — Döner Point
#
# Wandelt alle PNG-Bilder im Ordner Bilder in WebP um und verkleinert
# sie dabei auf die Groesse, in der sie tatsaechlich angezeigt werden.
# Die Originale bleiben unberuehrt, das Ergebnis landet in Bilder-webp.
#
# Voraussetzung: ImageMagick. Einmalig installieren mit
#   winget install ImageMagick.ImageMagick
# Danach ein neues PowerShell-Fenster oeffnen, damit magick im Pfad ist.
#
# Aufruf aus dem Ordner doener-point heraus:
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

# logo.png ist bereits freigestellt und klein. Es wird nicht
# umgewandelt, weil das Markup ausdruecklich auf die PNG zeigt und
# die Transparenz dort sauber sitzt.
$ueberspringen = @('logo')

# Zielbreite je Verwendungszweck. Jeweils etwa doppelt so breit wie
# die Anzeigegroesse, damit es auf Bildschirmen mit hoher Punktdichte
# scharf bleibt. Alles andere waere verschenkte Ladezeit.
$breiten = @{
  # Hero der Startseite, formatfuellend ueber die ganze Breite
  'hero'             = 2400

  # Aktionssektion, formatfuellend, aber nur 420px hoch
  'aktion'           = 1800

  # Kategoriekacheln der Startseite, quadratisch,
  # bis etwa 330px breit angezeigt
  'kat-sandwich'     = 900
  'kat-wrap'         = 900
  'kat-doener'       = 900
  'kat-suesses'      = 900
  'kat-lahmacun'     = 900
  'kat-snacks'       = 900

  # Bilderband ueber der Fusszeile, quadratisch, 300px breit
  'band1'            = 700
  'band2'            = 700
  'band3'            = 700
  'band4'            = 700
  'band5'            = 700
}

# Alles, was hier nicht steht, ist ein Gerichtbild der Karte.
# In den Kartenzeilen der Bestellseite werden sie als 100px-Quadrat
# angezeigt. 300 laesst Luft fuer hohe Punktdichte und fuer den Fall,
# dass die Zeilen spaeter groessere Bilder bekommen.
$standardBreite = 300

$dateien = Get-ChildItem -Path $quelle -Filter *.png
$vorher = 0
$nachher = 0
$anzahl = 0

foreach ($datei in $dateien) {
  $name = [System.IO.Path]::GetFileNameWithoutExtension($datei.Name)

  if ($ueberspringen -contains $name) {
    Write-Host ("{0,-24} uebersprungen" -f $name) -ForegroundColor DarkGray
    continue
  }

  $breite = if ($breiten.ContainsKey($name)) { $breiten[$name] } else { $standardBreite }
  $ausgabe = Join-Path $ziel "$name.webp"

  # Nur verkleinern, nie hochrechnen. Das Groesserzeichen sorgt dafuer.
  & magick $datei.FullName -resize "${breite}x${breite}>" -quality 82 -strip $ausgabe

  if (Test-Path $ausgabe) {
    $altKB = [math]::Round($datei.Length / 1KB)
    $neuKB = [math]::Round((Get-Item $ausgabe).Length / 1KB)
    $vorher += $datei.Length
    $nachher += (Get-Item $ausgabe).Length
    $anzahl++
    Write-Host ("{0,-24} {1,7} KB  ->  {2,6} KB" -f $name, $altKB, $neuKB)
  } else {
    Write-Host ("{0,-24} FEHLER" -f $name) -ForegroundColor Red
  }
}

Write-Host ''
Write-Host ('{0} Bilder: {1} MB  ->  {2} MB' -f $anzahl, `
  [math]::Round($vorher / 1MB, 2), [math]::Round($nachher / 1MB, 2)) -ForegroundColor Green
Write-Host ''
Write-Host 'Ergebnis liegt in Bilder-webp. Pruefe ein paar Bilder, dann:'
Write-Host '  Copy-Item .\Bilder-webp\*.webp .\Bilder -Force'
Write-Host '  Remove-Item .\Bilder\*.png -Exclude logo.png'
