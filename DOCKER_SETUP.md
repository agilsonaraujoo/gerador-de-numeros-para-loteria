# Setup Docker e GHCR (GitHub Container Registry)

## Status Atual

✅ **Dockerfile criado** — imagem baseada em Nginx Alpine
✅ **Imagem construída localmente** — `ghcr.io/agilsonaraujoo/gerador-de-n-meros-para-loteria:v1.0.0`
⏳ **Push para GHCR** — pendente (requer PAT com permissões `write:packages`)

## Como Fazer o Push (Instruções para Execução Local)

Se você estiver trabalhando localmente em sua máquina, siga estes passos:

### Passo 1: Gerar um Personal Access Token (PAT) no GitHub

1. Acesse: https://github.com/settings/tokens
2. Clique em **"Generate new token"** (escolha "Classic")
3. Dê um nome (ex.: `docker-push-token`)
4. Selecione os seguintes **scopes**:
   - ✅ `write:packages` — permite publicar imagens
   - ✅ `read:packages` — permite ler imagens
   - ✅ `delete:packages` — opcional, para limpeza
   - ✅ `repo` — recomendado para compatibilidade geral
5. Clique em **"Generate token"** e **copie o token** (você não poderá vê-lo novamente)

### Passo 2: Fazer Login no Docker/GHCR

```bash
# Substitua <SEU_TOKEN_AQUI> pelo token que você copiou no Passo 1
echo "<SEU_TOKEN_AQUI>" | docker login ghcr.io -u agilsonaraujoo --password-stdin
```

Esperado: `Login Succeeded`

### Passo 3: Construir a Imagem (se ainda não tiver)

```bash
cd /caminho/para/gerador-de-n-meros-para-loteria
docker build -t ghcr.io/agilsonaraujoo/gerador-de-n-meros-para-loteria:v1.0.0 .
```

### Passo 4: Fazer Push para o GHCR

```bash
docker push ghcr.io/agilsonaraujoo/gerador-de-n-meros-para-loteria:v1.0.0
```

Aguarde até que todos os layers sejam enviados. Esperado:
```
Successfully pushed
```

## Passo 5: Tornar a Imagem Pública

Após o push ter sucesso, altere a visibilidade:

1. Vá em: https://github.com/users/agilsonaraujoo/packages/container/gerador-de-n-meros-para-loteria
2. Clique em **"Package settings"** (ícone de engrenagem)
3. Vá até **"Change visibility"** → selecione **"Public"** → confirme

## Testar a Imagem Localmente

Após o push (ou mesmo antes), você pode testar a imagem localmente:

```bash
docker run -d -p 8080:80 --name loteria ghcr.io/agilsonaraujoo/gerador-de-n-meros-para-loteria:v1.0.0
```

Acesse no navegador: http://localhost:8080

Para parar o container:
```bash
docker stop loteria
docker rm loteria
```

## Link Final da Imagem (após push e visibilidade pública)

```
ghcr.io/agilsonaraujoo/gerador-de-n-meros-para-loteria:v1.0.0
```

## Referências

- [Docker Documentation](https://docs.docker.com/)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Nginx Docker Hub](https://hub.docker.com/_/nginx)

---

**Nota**: O ambiente de dev container não conseguiu fazer push automaticamente devido a restrições de permissão no token padrão do `gh CLI`. Para produção, é recomendado usar GitHub Actions com um `GITHUB_TOKEN` que já possui as permissões necessárias.
