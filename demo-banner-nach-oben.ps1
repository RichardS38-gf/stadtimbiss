# demo-banner-nach-oben.ps1
#
# Verschiebt den Demo-Banner in ALLEN Shops auf jeder Seite an den
# Anfang, also direkt hinter <body> und damit noch vor die
# Kopfzeile.
#
# Vorgehen je Datei:
#   1. bestehenden Banner entfernen, samt zugehoerigem Kommentar
#   2. neuen Banner direkt nach dem <body>-Tag einfuegen
#
# Das Skript ist mehrfach ausfuehrbar. Weil es erst entfernt und
# dann einfuegt, entsteht kein zweiter Banner.
#
# Dateien ohne Banner werden uebersprungen und am Ende gemeldet.
#
# Aufruf aus dem Ordner "Restaurant Online Shop" heraus:
#   .\demo-banner-nach-oben.ps1
#
# ACHTUNG: Das Skript schreibt direkt in die Dateien. Vorher
# sicherstellen, dass alles committet ist, dann kannst du mit
# "git diff" pruefen und im Zweifel alles verwerfen.

$basis = Join-Path $PSScriptRoot 'Beispielshops nach Branchen'

if (-not (Test-Path $basis)) {
  Write-Host "Ordner nicht gefunden: $basis" -ForegroundColor Red
  exit 1
}

# Der Baustein, der eingefuegt wird. Der Kommentar erklaert die
# Position, damit sie beim naechsten Umbau nicht versehentlich
# wieder wandert.
$banner = @"

  <!-- Demo-Banner steht als erstes Element, noch vor der
       Kopfzeile. Inhalt kommt aus js/auth.js. -->
  <div class="demo-banner" id="demo-banner"></div>
"@

# Entfernt den bestehenden Banner. Ein davorstehender Kommentar,
# der "Demo-Banner" enthaelt, wird mitgenommen.
$suchen = '(?s)[ \t]*(<!--[^<]*?[Dd]emo-[Bb]anner.*?-->[ \t]*\r?\n)?[ \t]*<div class="demo-banner" id="demo-banner"></div>[ \t]*\r?\n'

$geaendert = 0
$ohneBanner = @()

# UTF-8 ohne Bytefolgemarke. Ohne diese Angabe schreibt PowerShell
# eine Marke an den Dateianfang, und die steht dann vor dem
# DOCTYPE.
$kodierung = New-Object System.Text.UTF8Encoding($false)

Get-ChildItem -Path $basis -Filter *.html -Recurse | ForEach-Object {
  $datei = $_
  $inhalt = [System.IO.File]::ReadAllText($datei.FullName, $kodierung)

  if ($inhalt -notmatch 'id="demo-banner"') {
    $ohneBanner += $datei.FullName.Replace($basis, '').TrimStart('\')
    return
  }

  # 1. alten Banner entfernen
  $neu = [regex]::Replace($inhalt, $suchen, "")

  # 2. neuen Banner nach dem body-Tag einfuegen. Nur das erste
  #    Vorkommen, deshalb die 1 am Ende.
  $neu = [regex]::Replace($neu, '(<body[^>]*>)', "`$1$banner", 1)

  if ($neu -ne $inhalt) {
    [System.IO.File]::WriteAllText($datei.FullName, $neu, $kodierung)
    $kurz = $datei.FullName.Replace($basis, '').TrimStart('\')
    Write-Host ("umgestellt: {0}" -f $kurz)
    $geaendert++
  }
}

Write-Host ''
Write-Host ("Fertig. {0} Dateien umgestellt." -f $geaendert) -ForegroundColor Green

if ($ohneBanner.Count -gt 0) {
  Write-Host ''
  Write-Host 'Ohne Banner, deshalb uebersprungen:' -ForegroundColor Yellow
  $ohneBanner | ForEach-Object { Write-Host "  $_" }
  Write-Host ''
  Write-Host 'Diese Seiten brauchen den Banner vermutlich noch.'
}

Write-Host ''
Write-Host 'Jetzt mit "git diff" pruefen, bevor du committest.'
