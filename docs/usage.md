# Інструкція із запуску

## Передумови

Перед початком роботи встановіть і перевірте:

- Git:

  ```powershell
  git --version
  ```

- Node.js версії 20 або новішої:

  ```powershell
  node -v
  ```

  Версія повинна відповідати вимозі `Node.js >= 20`.
- npm:

  ```powershell
  npm -v
  ```

- VS Code з установленим і авторизованим GitHub Copilot та GitHub Copilot Chat.

## Запуск агента

Створіть окрему гілку для виконання агента:

```bash
git checkout -b feature/<назва>
```

У VS Code відкрийте **Copilot Chat**, перейдіть у режим **Agent** і виберіть агента
`build-engineer`.

У VS Code є вбудована команда `/init` з тією самою назвою. Тому для запуску
оркестратора виберіть саме `/init` і додайте опис:

```text
Оркеструє п'ять команд build-engineer у визначеному порядку
```

Альтернативно надішліть повідомлення:

```text
Виконай команду init з файлу .github/skills/init/SKILL.md
```

Оркестратор запускає окремі команди в такому порядку:

```text
/git-init
/create-project
/create-build
/create-actions
/check
```

Підтверджуйте лише безпечні команди. Відхиляйте запити на:

- `git commit`;
- `git push`;
- видалення файлів;
- `npm install -g`.

## Запуск зібраного проєкту — Windows (PowerShell)

У корені репозиторію виконайте:

```powershell
npm ci
npm start
npm test
.\ci.bat
.\build\hello.exe
npm run check
```

Очікувані результати:

- останній рядок `.\ci.bat` — `CI OK`;
- `.\build\hello.exe` — `Hello, World!`;
- `npm run check` — `CHECK PASSED: 11/11`.

## Запуск зібраного проєкту — Linux/macOS

У корені репозиторію виконайте:

```bash
npm ci
npm start
npm test
bash ci.sh
./build/hello
npm run check
```

Очікувані результати:

- `bash ci.sh` завершується рядком `CI OK`;
- `./build/hello` виводить `Hello, World!`;
- `npm run check` виводить `CHECK PASSED: 11/11`.

## Перевірка Git

Перевірте короткий статус репозиторію:

```bash
git status --short
```

У результаті не повинні з'являтися каталоги `build/` і `node_modules/`.

## Демонстрація навмисно зламаної перевірки

1. У файлі `tests/basic-addition.test.js` замініть `toBe(5)` на `toBe(6)`.
2. Запустіть перевірку:

   ```bash
   npm run check
   ```

   Очікується повідомлення `[FAIL] 7` і `CHECK FAILED`. Код виходу — `1`;
   у PowerShell його можна перевірити змінною `$LASTEXITCODE`.
3. Поверніть тест до початкового стану:

   ```bash
   git checkout -- tests/basic-addition.test.js
   npm run check
   ```

   Очікуваний результат — `CHECK PASSED`.

## GitHub Actions

Workflow CI запускається:

- після `push` у гілки `develop` і `master`;
- для `pull request` до гілок `develop` і `master`.

Workflow містить три job:

- `build` на `ubuntu-latest`;
- `build` на `windows-latest`;
- `build` на `macos-latest`.

Після успішного виконання створюються artifacts:

- `hello-ubuntu-latest`;
- `hello-windows-latest`;
- `hello-macos-latest`.
