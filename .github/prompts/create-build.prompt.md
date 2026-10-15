---
description: "Налаштовує збірку, Jest і локальний CI через skill build-and-test."
agent: build-engineer
---

# create-build

## Передумови

- Існує `src/hello.js`, який друкує рівно `Hello, World!`.
- Node.js `>= 20` і npm доступні.

## Дії

1. Перевірте `src/hello.js` і його запуск.
2. Прочитайте `.github/skills/build-and-test/SKILL.md` і виконайте його розділ **«Що створити»**.
3. Запустіть локальну збірку для поточної ОС: Windows PowerShell — `.\ci.bat`; Linux/macOS — `bash ci.sh`.
4. Переконайтеся, що виведено рядок `CI OK`. Якщо тест не проходить, з'ясуйте причину й не змінюйте тест лише для того, щоб він пройшов.

## Очікувані файли

- `src/add.js`, `tests/basic-addition.test.js`, `package.json`, `package-lock.json`, `.gitattributes`.
- `ci.sh`, `ci.bat` і тимчасовий ігнорований результат `build/hello` або `build/hello.exe`.

## Команди перевірки

```text
node src/hello.js
```

```powershell
.\ci.bat
```

```text
bash ci.sh
```

Очікуваний фінальний рядок: `CI OK`.

## Повідомлення про помилку

Формат: `create-build FAILED: <причина>`. Покажіть stderr і команду, що впала; не маскуйте помилку та не підміняйте тест.

## Повторний запуск

Ідемпотентність: не руйнує правильні файли, не дублює рядки та конфігурації, залежності встановлює лише локально й не виконує глобальних інсталяцій.
