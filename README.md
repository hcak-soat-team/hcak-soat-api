# ?? HCAK SOAT API

API Gateway para o sistema de processamento de vídeos em escala - HCAK SOAT Challenge.

## ?? Sumário

- [Visão Geral](#visão-geral)
- [Stack Tecnológico](#stack-tecnológico)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Rodando Localmente](#rodando-localmente)
- [API Endpoints](#api-endpoints)
- [Arquitetura](#arquitetura)
- [Próximos Passos](#próximos-passos)

## ?? Visão Geral

O **hcak-soat-api** é a API central que orquestra o fluxo de processamento de vídeos:

1. **Upload**: Usuários autenticados fazem upload de vídeos
2. **Fila**: Vídeos são enfileirados para processamento (SQS)
3. **Processamento**: Workers extraem frames usando FFmpeg
4. **Resultados**: Frames são salvos em S3 
5. **Notificação**: Usuários recebem email de conclusão

## ??? Stack Tecnológico

| Componente | Tecnologia |
|-----------|-----------|
| **API Framework** | NestJS 11 + TypeScript |
| **Database** | PostgreSQL 15 |
| **Cache** | Redis 7 |
| **Storage** | AWS S3 |
| **Messaging** | AWS SQS |
| **Auth** | AWS Cognito + JWT |
| **ORM** | TypeORM |
| **Containerização** | Docker + Docker Compose |

## ?? Estrutura do Projeto

````
src/
+-- modules/
¦   +-- videos/                 # Gerenciamento de vídeos
¦   ¦   +-- entities/
¦   ¦   +-- videos.controller.ts
¦   ¦   +-- videos.service.ts
¦   ¦   +-- videos.module.ts
¦   ¦
¦   +-- processing-jobs/        # Jobs de processamento
¦   ¦   +-- entities/
¦   ¦
¦   +-- notifications/          # Sistema de notificações
¦   ¦   +-- entities/
¦   ¦
¦   +-- health/                 # Health checks
¦
+-- common/
¦   +-- guards/                 # Guards (JWT, etc)
¦
+-- app.module.ts
+-- main.ts

migrations/
+-- 1711000000000-CreateVideoTables.ts
+--...

tests/
+-- app.e2e-spec.ts
+-- jest-e2e.json
````

## ?? Instalação

### Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- Docker & Docker Compose (opcional, recomendado)

### 1. Clonar e instalar dependências

```bash
git clone https://github.com/hcak-soat-team/hcak-soat-api.git
cd hcak-soat-api
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
# Editar .env com suas credenciais AWS, PostgreSQL, etc
```

## ?? Configuração

### Banco de Dados

```bash
# Executar migrations
npm run migration:up
```

### ENV Variables Essenciais

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=hcak_soat_api

AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
S3_BUCKET=hcak-soat-videos

JWT_SECRET=your-secret-key
```

## ??? Rodando Localmente

### Opção 1: Docker Compose (Recomendado)

```bash
docker-compose up -d
npm run start:dev
```

### Opção 2: Manualmente

```bash
# Terminal 1: PostgreSQL
docker run --name postgres -e POSTGRES_PASSWORD=postgres -d postgres:15

# Terminal 2: API
npm run migration:up
npm run start:dev
```

A API estará disponível em `http://localhost:3000`

## ?? API Endpoints

### Videos

**GET** `/videos` - Listar vídeos do usuário
```bash
curl -H "Authorization: Bearer JWT_TOKEN" \
  "http://localhost:3000/videos?userId=user-id"
```

Response:
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "user-123",
    "fileName": "my-video.mp4",
    "status": "PENDING",
    "uploadedAt": "2025-03-11T10:00:00Z"
  }
]
```

**POST** `/videos` - Criar novo vídeo
```bash
curl -X POST http://localhost:3000/videos \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "s3Key": "uploads/video-123.mp4",
    "fileName": "my-video.mp4",
    "userEmail": "user@example.com"
  }'
```

**GET** `/videos/:id` - Detalhes do vídeo
```bash
curl http://localhost:3000/videos/550e8400-e29b-41d4-a716-446655440000
```

**GET** `/videos/:id/download` - Presigned URL para download
```bash
curl http://localhost:3000/videos/550e8400-e29b-41d4-a716-446655440000/download
```

Response:
```json
{
  "downloadUrl": "https://s3.amazonaws.com/...",
  "videoId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**POST** `/videos/:id/presigned-upload` - Presigned URL para upload
```bash
curl -X POST http://localhost:3000/videos/550e8400-e29b-41d4-a716-446655440000/presigned-upload
```

### Health Check

**GET** `/health` - Status da aplicação
```bash
curl http://localhost:3000/health
```

## ??? Arquitetura

### Fluxo de Processamento

```
+-----------------+
¦    Frontend     ¦
+-----------------+
         ¦ POST /videos
         ?
+-----------------------------+
¦   API (hcak-soat-api)       ¦
¦  - Validação                ¦
¦  - Registro em DB           ¦
¦  - Publica em SQS           ¦
+-----------------------------+
         ¦ Message
         ?
+-----------------------------+
¦  SQS (Video Queue)          ¦
+-----------------------------+
         ¦ Consume
         ?
+-----------------------------+
¦ Video Processor (Worker)    ¦
¦  - FFmpeg frame extraction  ¦
¦  - Upload to S3             ¦
¦  - Update DB status         ¦
+-----------------------------+
         ¦ Success/Failure
         ?
+-----------------------------+
¦ Email Service               ¦
¦  - SendGrid notifications   ¦
+-----------------------------+
```

## ?? Integração com Outros Serviços

### Auth Lambda (JWT)
- Usuários autenticam via `hcak-soat-auth-lambda`
- JWT token é passado em headers: `Authorization: Bearer token`

### Video Slicer (Upload)
- FrontEnd integra com `/videos/:id/presigned-upload`
- Faz upload direto para S3
- Publica mensagem em SQS

### Video Processor (Worker)
- Consome mensagens da SQS
- Processa vídeo (FFmpeg)
- Atualiza status em PostgreSQL
- Publica evento em SNS/SQS

### Email Service
- Escuta eventos de conclusão/erro
- Envia notificações por email

## ?? Banco de Dados

### Tabelas

**videos**
```sql
CREATE TABLE videos (
  id UUID PRIMARY KEY,
  userId UUID NOT NULL,
  s3Key VARCHAR NOT NULL,
  fileName VARCHAR NOT NULL,
  status ENUM(PENDING, PROCESSING, COMPLETED, FAILED) DEFAULT PENDING,
  uploadedAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

**processing_jobs**
```sql
CREATE TABLE processing_jobs (
  id UUID PRIMARY KEY,
  videoId UUID REFERENCES videos(id),
  status ENUM(PENDING, IN_PROGRESS, COMPLETED, FAILED),
  totalFrames INTEGER,
  processedFrames INTEGER,
  s3OutputKey VARCHAR
);
```

**notifications**
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  videoId UUID REFERENCES videos(id),
  userId UUID NOT NULL,
  recipientEmail VARCHAR NOT NULL,
  type ENUM(...),
  status ENUM(PENDING, SENT, FAILED),
  createdAt TIMESTAMP DEFAULT NOW()
);
```

## ?? Testes

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

## ?? Logs

A aplicação usa Winston para logging:

```bash
# Arquivo de logs
tail -f logs/app.log
```

## ?? Troubleshooting

**"Cannot find module 'aws-sdk'"**
```bash
npm install aws-sdk
```

**"ECONNREFUSED" (PostgreSQL)**
```bash
# Verificar se PostgreSQL está rodando
docker ps | grep postgres
```

**JWT validation failed**
- Verifique se JWT_SECRET está correto
- Verifique se token está no header correto: `Authorization: Bearer token`

## ?? Segurança

- [x] Validação de entrada com class-validator
- [x] CORS configurado
- [x] Helmet para headers HTTP
- [x] Rate limiting (TODO)
- [x] JWT validation (TODO - integrar Auth Lambda)

## ?? Próximos Passos

- [ ] Integrar com Auth Lambda (JWT validation via Cognito)
- [ ] Implementar rate limiting
- [ ] Adicionar testes E2E
- [ ] Configurar logging distribuído
- [ ] Setup CI/CD com GitHub Actions
- [ ] Deploy em ECS
- [ ] Monitoramento com CloudWatch

## ?? Referências

- [NestJS Docs](https://docs.nestjs.com)
- [TypeORM Docs](https://typeorm.io)
- [AWS SDK Docs](https://docs.aws.amazon.com/sdk-for-javascript/)

## ?? Licença

MIT

---

**Status:** ?? MVP v1.0 - Pronto para inicial testes
