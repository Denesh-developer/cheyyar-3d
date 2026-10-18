$files = Get-ChildItem 'C:\Users\Administrator\.gemini\antigravity\scratch\nestmedia-clone\*.js'

foreach ($f in $files) {
    Write-Host "=== FILE: $($f.Name) ($($f.Length) bytes) ==="
    $content = Get-Content $f.FullName -Raw
    
    # All dynamic imports or asset references
    $chunks = [regex]::Matches($content, 'assets/[a-zA-Z0-9_\-]+\.js') | ForEach-Object { $_.Value } | Sort-Object -Unique
    if ($chunks) {
        Write-Host "  Chunks referenced: $($chunks -join ', ')"
    }
    
    # Look for fetch or api calls
    $apis = [regex]::Matches($content, '["''`]([^"'']*?api[^"'']*?)["''`]') | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique | Where-Object { $_.Length -lt 100 }
    if ($apis) {
        Write-Host "  API mentions: $($apis -join ' | ')"
    }

    # Look for php
    $phps = [regex]::Matches($content, '["''`]([^"'']*\.php[^"'']*)["''`]') | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique | Where-Object { $_.Length -lt 100 }
    if ($phps) {
        Write-Host "  PHP mentions: $($phps -join ' | ')"
    }

    # Look for wss or socket
    $wss = [regex]::Matches($content, '["''`](wss?://[^"'']+|[^"'']*socket[^"'']*)["''`]') | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique | Where-Object { $_.Length -lt 100 }
    if ($wss) {
        Write-Host "  Socket/WS mentions: $($wss -join ' | ')"
    }
}
