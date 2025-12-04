#!/bin/bash

# Script para fazer push da imagem Docker para GHCR
# Este script guia você a gerar um PAT e fazer o push

set -e

echo "=========================================="
echo "  Docker Push para GitHub Container Registry"
echo "=========================================="
echo ""

# Cores para melhor visualização
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Passo 1: Gerar um Personal Access Token (PAT)${NC}"
echo ""
echo "Você precisa criar um novo token no GitHub com os scopes corretos."
echo ""
echo "1. Acesse: ${YELLOW}https://github.com/settings/tokens${NC}"
echo "2. Clique em '${GREEN}Generate new token${NC}' → escolha '${GREEN}Generate new token (classic)${NC}'"
echo "3. Preencha:"
echo "   - Nome: ${YELLOW}docker-ghcr-push${NC}"
echo "   - Expiração: ${YELLOW}30 days${NC}"
echo ""
echo "4. Selecione EXATAMENTE estes scopes:"
echo "   ✅ ${GREEN}write:packages${NC}"
echo "   ✅ ${GREEN}read:packages${NC}"
echo "   ✅ ${GREEN}delete:packages${NC}"
echo "   ✅ ${GREEN}repo${NC}"
echo ""
echo "5. Clique em '${GREEN}Generate token${NC}' e ${RED}COPIE O TOKEN${NC}"
echo ""
echo -e "${YELLOW}Aguardando seu token...${NC}"
echo ""

# Ler o token do usuário
read -sp "Cole o token aqui: " PAT
echo ""
echo ""

# Validar que o token foi fornecido
if [ -z "$PAT" ]; then
  echo -e "${RED}Erro: Token não foi fornecido!${NC}"
  exit 1
fi

echo -e "${BLUE}Passo 2: Fazendo login no Docker...${NC}"
if echo "$PAT" | docker login ghcr.io -u agilsonaraujoo --password-stdin > /dev/null 2>&1; then
  echo -e "${GREEN}✓ Login bem-sucedido!${NC}"
else
  echo -e "${RED}✗ Falha no login. Token pode estar inválido.${NC}"
  exit 1
fi

echo ""
echo -e "${BLUE}Passo 3: Fazendo push da imagem...${NC}"
echo "(Isso pode levar alguns minutos)"
echo ""

if docker push ghcr.io/agilsonaraujoo/gerador-de-n-meros-para-loteria:v1.0.0; then
  echo ""
  echo -e "${GREEN}=========================================="
  echo "✓ Push bem-sucedido!"
  echo "==========================================${NC}"
  echo ""
  echo -e "${BLUE}Passo 4: Tornar a imagem pública${NC}"
  echo ""
  echo "1. Acesse: ${YELLOW}https://github.com/users/agilsonaraujoo/packages/container/gerador-de-n-meros-para-loteria${NC}"
  echo "2. Clique em '${GREEN}Package settings${NC}' (ícone de engrenagem)"
  echo "3. Clique em '${GREEN}Change visibility${NC}'"
  echo "4. Selecione '${GREEN}Public${NC}' e confirme"
  echo ""
  echo -e "${GREEN}Pronto! Sua imagem estará disponível em:${NC}"
  echo "${YELLOW}ghcr.io/agilsonaraujoo/gerador-de-n-meros-para-loteria:v1.0.0${NC}"
  echo ""
  echo -e "${BLUE}Para testar localmente:${NC}"
  echo "  docker run -d -p 8080:80 ghcr.io/agilsonaraujoo/gerador-de-n-meros-para-loteria:v1.0.0"
  echo "  # Abra: http://localhost:8080"
  echo ""
else
  echo -e "${RED}✗ Falha ao fazer push!${NC}"
  echo "Verifique se:"
  echo "  - O token foi gerado com os scopes corretos"
  echo "  - Sua conta tem permissão para publicar pacotes"
  exit 1
fi
