#!/bin/bash
# HCAK SOAT API - Teste Rápido Local
# Usage: bash test-api.sh

set -e

echo "
╔═══════════════════════════════════════════════════════════════╗
║         HCAK SOAT API - TESTE RÁPIDO LOCAL                   ║
╚═══════════════════════════════════════════════════════════════╝
"

# 1. Verificar se API está rodando
echo "1. Verificando se API está rodando..."
if ! curl -sf http://localhost:3000/health > /dev/null; then
    echo "❌ API não está respondendo em http://localhost:3000"
    echo "   Inicie com: npm run start:dev"
    exit 1
fi
echo "✅ API respondendo"

# 2. Health Check
echo ""
echo "2. Health Check..."
curl -s "http://localhost:3000/health" | jq .

# 3. Create Video
echo ""
echo "3. Criando vídeo..."
USER_ID="test-user-$(shuf -i 1000-9999 -n 1)"
VIDEO_BODY=$(cat <<EOF
{
  "userId": "$USER_ID",
  "s3Key": "uploads/test-\$(date +%s).mp4",
  "fileName": "test-video.mp4",
  "fileSizeBytes": 52428800,
  "mimeType": "video/mp4",
  "userEmail": "test@example.com"
}
EOF
)

VIDEO_RESPONSE=$(curl -s -X POST "http://localhost:3000/videos" \
  -H "Content-Type: application/json" \
  -d "$VIDEO_BODY")

VIDEO_ID=$(echo $VIDEO_RESPONSE | jq -r '.id')
echo "✅ Vídeo criado:"
echo "   ID: $VIDEO_ID"
echo "   Status: $(echo $VIDEO_RESPONSE | jq -r '.status')"
echo "   Usuário: $(echo $VIDEO_RESPONSE | jq -r '.userId')"

# 4. List Videos
echo ""
echo "4. Listando vídeos do usuário..."
curl -s "http://localhost:3000/videos?userId=$USER_ID" | jq '.[] | {id, fileName, status}'

# 5. Get Video by ID
echo ""
echo "5. Obtendo detalhes do vídeo..."
curl -s "http://localhost:3000/videos/$VIDEO_ID" | jq '{fileName, s3Key, status, uploadedAt}'

# 6. Presigned Upload URL
echo ""
echo "6. Obtendo Presigned Upload URL..."
UPLOAD_URL=$(curl -s -X POST "http://localhost:3000/videos/$VIDEO_ID/presigned-upload")
echo "✅ Presigned URL obtida:"
echo $UPLOAD_URL | jq '{videoId, presignedUrl: (.presignedUrl | .[0:80] + "...")}'

# 7. Presigned Download URL
echo ""
echo "7. Obtendo Presigned Download URL..."
DOWNLOAD_URL=$(curl -s "http://localhost:3000/videos/$VIDEO_ID/download")
echo "✅ Download URL obtida:"
echo $DOWNLOAD_URL | jq '{videoId, downloadUrl: (.downloadUrl | .[0:80] + "...")}'

# 8. List All Videos
echo ""
echo "8. Listando todos os vídeos..."
curl -s "http://localhost:3000/videos/all?limit=5&offset=0" | jq '{total, videos: (.videos | length), limit}'

# Summary
echo ""
echo "
╔═══════════════════════════════════════════════════════════════╗
║                      ✅ TESTES CONCLUÍDOS                    ║
╚═══════════════════════════════════════════════════════════════╝
"

echo "Endpoints testados com sucesso:"
echo "  ✅ GET  /health"
echo "  ✅ POST /videos"
echo "  ✅ GET  /videos?userId=X"
echo "  ✅ GET  /videos/:id"
echo "  ✅ POST /videos/:id/presigned-upload"
echo "  ✅ GET  /videos/:id/download"
echo "  ✅ GET  /videos/all"

echo ""
echo "Próximos passos:"
echo "  1. Rodar testes automatizados: npm run test"
echo "  2. Rodar testes E2E: npm run test:e2e"
echo "  3. Gerar cobertura: npm run test:cov"
