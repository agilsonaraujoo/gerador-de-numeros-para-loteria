# Gerador de Números para Loteria

Pequeno gerador de jogos para modalidades como Mega-Sena, Quina e Lotofácil.

Funcionalidades:
- Gera jogos aleatórios conforme modalidade selecionada.
- Permite gerar múltiplos jogos, copiar/baixar resultados e filtrar números banidos.

Como executar localmente

1. Abra o arquivo `index.html` em um navegador moderno.
2. Use os controles para escolher a modalidade, quantidade de jogos e gerar os números.

Contribuições

Sinta-se à vontade para abrir issues ou pull requests com melhorias de interface, validações adicionais ou exportadores diferentes.

Licença: veja o arquivo `LICENSE`.
# Gerador de Números para Loteria

Projeto web (HTML/CSS/JS) sem backend.

## Modalidades
- Mega-Sena: 6 números, 1-60
- Quina: 5 números, 1-80
- Lotofácil: 15 números, 1-25

## Como usar localmente
Abra `index.html` no navegador.

### Recursos
- Quantidade de jogos: selecione 1–10.
- Banidos: informe números separados por vírgula (ex.: `13, 22, 45`).
- Copiar: copia todos os jogos gerados.
- Limpar: limpa o resultado atual.
- Baixar TXT: baixa um `.txt` com todos os jogos.
- Histórico: exibe as últimas 5 gerações.

Atalhos:
- Enter: gerar números (quando possível).

## Fluxo de branches
- main: releases estáveis (v1.0.0, v2.0.0)
- develop: integração contínua
- features: feature/nome

## Versões
- v1.0.0: primeiro release funcional (sem foco estético)
- v2.0.0: melhorias de UI/estética

## Commits e contribuição
- Padrões de mensagem: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `chore:`.
- Trabalhe em `develop` e abra PR para `main`.
- Use SemVer: https://semver.org/lang/pt-BR/
- Modelo de branches (Git Flow): https://nvie.com/posts/a-successful-git-branching-model/
