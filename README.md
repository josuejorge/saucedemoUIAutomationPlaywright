# Saucedemo UI Automation — Playwright

Automação de testes E2E com [Playwright](https://playwright.dev/) + TypeScript para o site [https://www.saucedemo.com/](https://www.saucedemo.com/).

<img width="889" height="392" alt="image" src="https://github.com/user-attachments/assets/3ef99803-b5f8-4bad-955d-570b1e846970" />

<img width="1901" height="914" alt="image" src="https://github.com/user-attachments/assets/dd9e73bd-3093-4fe7-815a-1fe0a3730d21" />

<img width="1892" height="904" alt="image" src="https://github.com/user-attachments/assets/8ce299e1-7af5-4e8d-ab5e-daa3905e01bd" />

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- [Java 8+](https://adoptium.net/) (necessário para o Allure CLI)
- npm (incluído com o Node.js)

---

## Instalação

### 1. Instalar dependências do projeto

```bash
npm install
```

### 2. Instalar os navegadores do Playwright

```bash
npx playwright install
```

> Baixa os binários do Chromium, Firefox e WebKit usados nos testes.

### 3. Instalar o Allure CLI (global)

```bash
npm install -g allure-commandline
```

> Requer Java instalado na máquina. Verifique com `java -version`.

---

## Estrutura do projeto

```
├── fixtures/               # Custom fixture com step + screenshot automático
├── pages/                  # Page Objects (LoginPage, HomePage, CartPage, etc.)
├── reporters/              # Reporter customizado de evidências HTML por teste
├── tests/
│   ├── login/              # 6 testes de autenticação
│   ├── home/               # 9 testes da tela principal
│   ├── cards/              # 7 testes de produtos
│   └── cart/               # 5 testes de carrinho e checkout
├── global-setup.ts         # Login único antes de toda a suite
├── playwright.config.ts
└── package.json
```

---

## Rodando os testes

### Execução padrão (headless, 4 workers em paralelo)

```bash
npm test
```

### Com navegador visível (headed)

```bash
npm run test:headed
```

### Com interface visual do Playwright

```bash
npm run test:ui
```

### Rodar uma suite específica

```bash
npx playwright test tests/login
npx playwright test tests/home
npx playwright test tests/cards
npx playwright test tests/cart
```

### Rodar um teste específico por nome

```bash
npx playwright test -g "Validar Login Com Sucesso"
```

---

## Relatórios

### Playwright HTML Report (built-in)

Gerado automaticamente após cada execução em `playwright-report/`.

```bash
npm run report
```

> Abre o relatório no navegador.

### Allure Report

Os resultados são salvos em `allure-results/` a cada execução.

**Gerar e abrir o relatório:**

```bash
allure generate allure-results -o allure-report --clean
allure open allure-report
```

> O relatório abre automaticamente no navegador.

---

## Evidências por teste

Cada teste gera um arquivo HTML individual em `evidence/` com:

- Metadados do teste (status, duração, data)
- Cada step com o screenshot tirado ao final

Os arquivos ficam em `evidence/<nome-do-teste>.html`.

> `evidence/`, `allure-results/`, `allure-report/` e `.auth/` estão no `.gitignore` e não são versionados.

---

## Paralelismo e otimização

- **`globalSetup`**: faz login uma única vez antes de toda a suite e salva a sessão em `.auth/user.json`
- **`storageState`**: cada teste restaura a sessão automaticamente, sem precisar logar de novo
- **`workers: 4`**: 4 testes rodando em paralelo (2 no CI via `process.env.CI`)
- Testes de login usam `test.use({ storageState: { cookies: [], origins: [] } })` para começar sem sessão ativa
