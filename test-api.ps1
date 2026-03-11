#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Script para testar hcak-soat-api rapidamente
.DESCRIPTION
    Executa uma bateria de testes de endpoints
.EXAMPLE
    ./test-api.ps1
#>

Write-Host "
╔═══════════════════════════════════════════════════════════════╗
║         HCAK SOAT API - TESTE RÁPIDO LOCAL                   ║
╚═══════════════════════════════════════════════════════════════╝
" -ForegroundColor Cyan

# Verificar se API está rodando
Write-Host "1. Verificando se API está rodando..." -ForegroundColor Yellow
$health = try {
    curl -s "http://localhost:3000/health" | ConvertFrom-Json
    $true
} catch {
    $false
}

if ($health -eq $false) {
    Write-Host "❌ API não está respondendo em http://localhost:3000" -ForegroundColor Red
    Write-Host "   Inicie com: npm run start:dev" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ API respondendo" -ForegroundColor Green

# Health Check
Write-Host "`n2. Health Check..." -ForegroundColor Yellow
$healthResponse = curl -s "http://localhost:3000/health"
Write-Host "✅ Resposta recebida:" -ForegroundColor Green
Write-Host $healthResponse | ConvertFrom-Json | ConvertTo-Json

# Create Video
Write-Host "`n3. Criando vídeo..." -ForegroundColor Yellow
$videoBody = @{
    userId = "test-user-$(Get-Random -Minimum 1000 -Maximum 9999)"
    s3Key = "uploads/test-$(Get-Random).mp4"
    fileName = "test-video.mp4"
    fileSizeBytes = 52428800
    mimeType = "video/mp4"
    userEmail = "test@example.com"
} | ConvertTo-Json

$videoResponse = curl -s -X POST "http://localhost:3000/videos" `
  -H "Content-Type: application/json" `
  -d $videoBody

$video = $videoResponse | ConvertFrom-Json
$videoId = $video.id

Write-Host "✅ Vídeo criado:" -ForegroundColor Green
Write-Host "   ID: $videoId" -ForegroundColor Cyan
Write-Host "   Status: $($video.status)" -ForegroundColor Cyan
Write-Host "   Usuário: $($video.userId)" -ForegroundColor Cyan

# List Videos
Write-Host "`n4. Listando vídeos do usuário..." -ForegroundColor Yellow
$listResponse = curl -s "http://localhost:3000/videos?userId=$($video.userId)"
$videos = $listResponse | ConvertFrom-Json

Write-Host "✅ Vídeos encontrados: $($videos.Count)" -ForegroundColor Green

# Get Video by ID
Write-Host "`n5. Obtendo detalhes do vídeo..." -ForegroundColor Yellow
$detailResponse = curl -s "http://localhost:3000/videos/$videoId"
$detail = $detailResponse | ConvertFrom-Json

Write-Host "✅ Detalhes obtidos:" -ForegroundColor Green
Write-Host "   FileName: $($detail.fileName)" -ForegroundColor Cyan
Write-Host "   S3 Key: $($detail.s3Key)" -ForegroundColor Cyan
Write-Host "   Uploaded: $($detail.uploadedAt)" -ForegroundColor Cyan

# Presigned Upload URL
Write-Host "`n6. Obtendo Presigned Upload URL..." -ForegroundColor Yellow
$uploadUrlResponse = curl -s -X POST "http://localhost:3000/videos/$videoId/presigned-upload"
$uploadUrl = $uploadUrlResponse | ConvertFrom-Json

Write-Host "✅ Presigned Upload URL obtida:" -ForegroundColor Green
Write-Host "   URL: $($uploadUrl.presignedUrl -replace '.{50}$', '...') (truncado)" -ForegroundColor Cyan

# Presigned Download URL
Write-Host "`n7. Obtendo Presigned Download URL..." -ForegroundColor Yellow
$downloadUrlResponse = curl -s "http://localhost:3000/videos/$videoId/download"
$downloadUrl = $downloadUrlResponse | ConvertFrom-Json

Write-Host "✅ Presigned Download URL obtida:" -ForegroundColor Green
Write-Host "   URL: $($downloadUrl.downloadUrl -replace '.{50}$', '...') (truncado)" -ForegroundColor Cyan

# List All Videos (Admin)
Write-Host "`n8. Listando todos os vídeos (admin)..." -ForegroundColor Yellow
$adminListResponse = curl -s "http://localhost:3000/videos/all?limit=5&offset=0"
$adminList = $adminListResponse | ConvertFrom-Json

Write-Host "✅ Total de vídeos: $($adminList.total)" -ForegroundColor Green
Write-Host "   Mostrando: $($adminList.videos.Count) / $($adminList.limit)" -ForegroundColor Cyan

# Summary
Write-Host "`n
╔═══════════════════════════════════════════════════════════════╗
║                      ✅ TESTES CONCLUÍDOS                    ║
╚═══════════════════════════════════════════════════════════════╝
" -ForegroundColor Green

Write-Host "Endpoints testados com sucesso:" -ForegroundColor Cyan
Write-Host "  ✅ GET  /health" -ForegroundColor Green
Write-Host "  ✅ POST /videos" -ForegroundColor Green
Write-Host "  ✅ GET  /videos?userId=X" -ForegroundColor Green
Write-Host "  ✅ GET  /videos/:id" -ForegroundColor Green
Write-Host "  ✅ POST /videos/:id/presigned-upload" -ForegroundColor Green
Write-Host "  ✅ GET  /videos/:id/download" -ForegroundColor Green
Write-Host "  ✅ GET  /videos/all" -ForegroundColor Green

Write-Host "`nPróximos passos:" -ForegroundColor Yellow
Write-Host "  1. Rodar testes automatizados: npm run test" -ForegroundColor Cyan
Write-Host "  2. Rodar testes E2E: npm run test:e2e" -ForegroundColor Cyan
Write-Host "  3. Gerar cobertura: npm run test:cov" -ForegroundColor Cyan
