# Lists candidate photos (not diagrams) from Wikimedia Commons categories, with license metadata.
param([string[]]$Cats)
$ua = 'DrumoBot/0.1 (contact@drumo.ro)'
$out = @()
foreach ($c in $Cats) {
  $u = "https://commons.wikimedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle=Category:$c&gcmtype=file&gcmlimit=100&prop=imageinfo&iiprop=url|extmetadata|size|mime&iiurlwidth=1200&format=json"
  $r = Invoke-RestMethod $u -UserAgent $ua
  if (-not $r.query) { continue }
  foreach ($p in $r.query.pages.PSObject.Properties.Value) {
    $ii = $p.imageinfo[0]
    if ($ii.mime -notmatch 'jpeg|png') { continue }
    $m = $ii.extmetadata
    $out += [pscustomobject]@{
      cat = $c; title = $p.title; w = $ii.width; h = $ii.height
      license = $m.LicenseShortName.value; author = ($m.Artist.value -replace '<[^>]+>', '').Trim()
      thumb = $ii.thumburl; page = $ii.descriptionurl; date = $m.DateTimeOriginal.value
    }
  }
}
$out | ConvertTo-Json -Depth 3
