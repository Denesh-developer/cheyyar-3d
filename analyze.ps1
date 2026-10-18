$indexContent = Get-Content 'C:\Users\Administrator\.gemini\antigravity\scratch\nestmedia-clone\index.js' -Raw

Write-Host "=== CHUNKS IN INDEX.JS ==="
[regex]::Matches($indexContent, 'assets/[a-zA-Z0-9_\-]+\.js') | ForEach-Object { $_.Value } | Sort-Object -Unique

Write-Host "`n=== API ENDPOINTS IN INDEX.JS ==="
[regex]::Matches($indexContent, 'api/index\.php\?a=[a-zA-Z0-9_\-]+') | ForEach-Object { $_.Value } | Sort-Object -Unique

Write-Host "`n=== WEBSOCKET / SYNC IN INDEX.JS ==="
[regex]::Matches($indexContent, '(wss?://[^\s''"`]+|/ws[^\s''"`]*)') | ForEach-Object { $_.Value } | Sort-Object -Unique

Write-Host "`n=== ASSET REFERENCES (models, audio, textures, bakes) ==="
[regex]::Matches($indexContent, '["''](/bake/[^"'']+|/audio/[^"'']+|/models/[^"'']+|/textures/[^"'']+|/data/[^"'']+|/images/[^"'']+)["'']') | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique

Write-Host "`n=== CORE.JS CHUNKS & ASSETS ==="
$coreContent = Get-Content 'C:\Users\Administrator\.gemini\antigravity\scratch\nestmedia-clone\core.js' -Raw
[regex]::Matches($coreContent, 'assets/[a-zA-Z0-9_\-]+\.js') | ForEach-Object { $_.Value } | Sort-Object -Unique
[regex]::Matches($coreContent, 'api/index\.php\?a=[a-zA-Z0-9_\-]+') | ForEach-Object { $_.Value } | Sort-Object -Unique
[regex]::Matches($coreContent, '["''](/bake/[^"'']+|/audio/[^"'']+|/models/[^"'']+|/textures/[^"'']+|/data/[^"'']+|/images/[^"'']+)["'']') | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
