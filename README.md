# Лабораторна робота: AI-агент для автоматизації розробки та CI/CD

**Студент:** Плюкар Володимир Андрійович

**Група:** КІ-409
**Варіант:** 15 — JavaScript (Node.js), npm scripts, Jest

## Мета та опис

Репозиторій містить конфігурацію AI-агента `build-engineer` для GitHub Copilot у VS Code. Агент автоматизує підготовку кросплатформного JavaScript-проєкту:

- генерує програму Hello World на JavaScript;
- створює функцію `add(a, b)` і тест `BasicAddition` на Jest;
- створює скрипти `ci.sh` і `ci.bat`, які запускають перевірки та створюють виконуваний файл `hello`;
- налаштовує GitHub Actions для Windows, Linux і macOS.

На цій гілці зберігаються агент і документація. Файли JavaScript-проєкту, `package.json`, тести та CI-скрипти створюються агентом під час виконання відповідних команд.

## Запуск агента

1. Відкрити Copilot Chat у VS Code.
2. Перейти в режим **Agent**.
3. Вибрати агента **build-engineer**.
4. Виконати команду `/init`.

Команда `/init` запускає послідовність підготовки проєкту та перевірок, описану в [архітектурі агента](docs/architecture.md). Оркестратор `init` зупиняється на першій помилці, а команда `check` проходить усі перевірки та показує `PASS`/`FAIL` для кожної.

## Структура репозиторію

```text
lab1-ai-agent-js/
├── README.md
├── .gitignore
├── .github/
│   ├── agents/
│   │   └── build-engineer.agent.md
│   └── skills/
│       ├── build-and-test/
│       │   └── SKILL.md
│       ├── check/
│       │   └── SKILL.md
│       ├── create-actions/
│       │   └── SKILL.md
│       ├── create-build/
│       │   └── SKILL.md
│       ├── create-project/
│       │   └── SKILL.md
│       ├── github-actions/
│       │   └── SKILL.md
│       ├── git-init/
│       │   └── SKILL.md
│       ├── init/
│       │   └── SKILL.md
│       └── project-scaffold/
│           └── SKILL.md
└── docs/
    ├── ai-log.md
    └── architecture.md
```

Команди та skills у дереві є цільовою структурою конфігурації Copilot; їхні файли створюються окремими етапами роботи над агентом.

## Документація

- [Архітектура агента](docs/architecture.md)
- [Журнал взаємодії з AI](docs/ai-log.md)
