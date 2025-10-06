#!/bin/bash
# Deploy script para frontend com variáveis de ambiente

# Configurar URLs da API baseadas no ALB do CloudFormation
export NEXT_PUBLIC_API_URL="https://${ALB_DNS_NAME}/api"
export NEXT_PUBLIC_FINANCIAL_API_URL="https://${FINANCIAL_ALB_DNS_NAME}/api"
export NEXT_PUBLIC_ENVIRONMENT="production"
export NEXT_PUBLIC_APP_VERSION="1.0.0"

# Build do frontend com variáveis
cd frontend
npm run build

# Deploy para S3 + CloudFront
aws s3 sync .next/static s3://${FRONTEND_BUCKET}/static
aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_ID} --paths "/*"

echo "Frontend deployed with API URLs:"
echo "Core API: $NEXT_PUBLIC_API_URL"
echo "Financial API: $NEXT_PUBLIC_FINANCIAL_API_URL"