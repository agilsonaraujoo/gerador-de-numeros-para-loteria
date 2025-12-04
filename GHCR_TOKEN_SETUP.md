# Guia: Como Gerar um PAT com Permissões para GHCR

## ⚠️ Problema Identificado

Um PAT (Personal Access Token) foi criado **sem nenhum scope**, o que impede fazer push de imagens Docker para o GitHub Container Registry.

**Erro obtido:**
```
denied: permission_denied: The token provided does not match expected scopes.
```

**Por que isso aconteceu?**
- O token foi gerado na página de tokens do GitHub mas nenhum scope foi selecionado
- Sem scopes, o token não tem permissão para nada (nem ler, nem escrever)

---

## ✅ Solução: Gerar um Novo PAT com Scopes Corretos

### Passo 1: Acessar a Página de Tokens

1. Vá para: **https://github.com/settings/tokens**
2. Você verá uma lista de seus tokens existentes

### Passo 2: Criar um Novo Token (Classic)

1. Clique em **"Generate new token"** (no canto superior direito)
2. Escolha **"Generate new token (classic)"** (não use a versão "fine-grained")

### Passo 3: Configurar o Token

**Nome do token:**
```
docker-ghcr-push
```

**Expiração:**
- Selecione "30 days" (ou quanto achar apropriado)
- Nota: tokens com expiração nunca são uma má ideia

**Scopes (IMPORTANTE — Marque EXATAMENTE estes):**

✅ `write:packages` — **Essencial para fazer push**
✅ `read:packages` — **Essencial para ler pacotes**
✅ `delete:packages` — *(opcional, mas recomendado para limpeza)*
✅ `repo` — *(recomendado para compatibilidade geral)*

**NÃO marque:**
- ❌ `admin:org_hook`
- ❌ `admin:gpg_key`
- ❌ Ou qualquer outro escopo não listado acima

### Passo 4: Gerar e Copiar o Token

1. Clique em **"Generate token"** (botão verde no final da página)
2. **COPIE o token imediatamente** — você não poderá vê-lo novamente
3. Salve-o em um lugar seguro (ex.: gestor de senhas, arquivo `.env.local`)

---

## 🔐 Fazer Login no Docker com o Novo Token

Assim que tiver o novo token, execute:

```bash
# Substitua <SEU_NOVO_TOKEN> pelo token gerado acima
echo "<SEU_NOVO_TOKEN>" | docker login ghcr.io -u agilsonaraujoo --password-stdin
```

Esperado:
```
Login Succeeded
```

---

## 📤 Fazer Push da Imagem

Após login bem-sucedido:

```bash
docker push ghcr.io/agilsonaraujoo/gerador-de-n-meros-para-loteria:v1.0.0
```

Acompanhe o progresso. Esperado (fim do log):
```
The push refers to repository [ghcr.io/agilsonaraujoo/gerador-de-n-meros-para-loteria]
...
Successfully pushed
```

---

## 👀 Tornar a Imagem Pública

Após o push ter sucesso:

1. Acesse: **https://github.com/users/agilsonaraujoo/packages/container/gerador-de-n-meros-para-loteria**
2. Clique no ícone de engrenagem ⚙️ (**Package settings**)
3. Vá até **"Change visibility"**
4. Selecione **"Public"**
5. Clique em **"Change visibility"** para confirmar

Agora a imagem está disponível publicamente! 🎉

---

## 🧪 Testar a Imagem (Opcional)

Após tornar pública, qualquer pessoa (você inclusive) pode baixar e rodar:

```bash
docker pull ghcr.io/agilsonaraujoo/gerador-de-n-meros-para-loteria:v1.0.0
docker run -d -p 8080:80 ghcr.io/agilsonaraujoo/gerador-de-n-meros-para-loteria:v1.0.0
# Acesse: http://localhost:8080
```

---

## 🔗 Link Final da Imagem

```
ghcr.io/agilsonaraujoo/gerador-de-n-meros-para-loteria:v1.0.0
```

**Página do pacote:**
```
https://github.com/users/agilsonaraujoo/packages/container/gerador-de-n-meros-para-loteria
```

---

## 📚 Referências

- [Creating a personal access token (classic)](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic)
- [Working with the Container registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Docker login documentation](https://docs.docker.com/engine/reference/commandline/login/)

---

**Pronto?** Gere um novo token com os scopes corretos e me avise para fazer o push! 🚀
