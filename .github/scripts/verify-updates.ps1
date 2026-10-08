$ErrorActionPreference = 'Stop'
$bytes = [IO.File]::ReadAllBytes((Join-Path $PWD 'updates.json'))
$signature = [IO.File]::ReadAllBytes((Join-Path $PWD 'updates.json.sig'))
if ($bytes.Length -gt 65536 -or $signature.Length -gt 8192) { throw 'Update metadata is too large.' }
$rsa = [Security.Cryptography.RSA]::Create()
try {
    $rsa.ImportFromPem([IO.File]::ReadAllText((Join-Path $PWD 'update-public-key.pem')))
    if ($signature.Length -ne 384) {
        $envelope = [Text.Encoding]::UTF8.GetString($signature) | ConvertFrom-Json
        $authorization = [Convert]::FromBase64String($envelope.authorization)
        $payload = [Text.Encoding]::UTF8.GetBytes("AdTrim update signing key v1`n") + $authorization
        if (-not $rsa.VerifyData($payload, [Convert]::FromBase64String($envelope.authorizationSignature), [Security.Cryptography.HashAlgorithmName]::SHA256, [Security.Cryptography.RSASignaturePadding]::Pss)) { throw 'Signing key is not authorized.' }
        $certificate = [Text.Encoding]::UTF8.GetString($authorization) | ConvertFrom-Json
        if ([DateTimeOffset]$certificate.expiresAt -le [DateTimeOffset]::UtcNow) { throw 'Signing authorization expired.' }
        $rsa.ImportFromPem($certificate.publicKey)
        $signature = [Convert]::FromBase64String($envelope.signature)
    }
    if ($rsa.KeySize -ne 3072 -or -not $rsa.VerifyData($bytes, $signature, [Security.Cryptography.HashAlgorithmName]::SHA256, [Security.Cryptography.RSASignaturePadding]::Pss)) { throw 'Invalid update signature.' }
} finally { $rsa.Dispose() }
$feed = [Text.Encoding]::UTF8.GetString($bytes) | ConvertFrom-Json
if ($feed.schema -ne 1 -or $feed.revision -lt 1 -or $feed.latestVersion -cnotmatch '^(0|[1-9][0-9]{0,4})\.(0|[1-9][0-9]{0,4})\.(0|[1-9][0-9]{0,4})$') { throw 'Invalid feed schema or version.' }
if (-not $feed.publishedAt -or [DateTimeOffset]$feed.publishedAt -gt [DateTimeOffset]::UtcNow.AddMinutes(5)) { throw 'Invalid publication date.' }
$headers = @{ 'User-Agent'='AdTrim-update-feed-validation' }
if ($env:GITHUB_TOKEN) { $headers.Authorization = 'Bearer ' + $env:GITHUB_TOKEN }
$release = Invoke-RestMethod -Uri ('https://api.github.com/repos/adtrim/adtrim/releases/tags/v' + $feed.latestVersion) -Headers $headers
if ($release.draft -or $release.prerelease -or -not ($release.assets | Where-Object name -CEQ ('AdTrim-Setup-v' + $feed.latestVersion + '.exe'))) { throw 'A stable release and installer must exist before announcement.' }
Write-Output ('Verified update feed for v' + $feed.latestVersion)
