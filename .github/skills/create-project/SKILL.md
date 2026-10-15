---
name: create-project
description: Створює початковий JavaScript-каркас hello через skill project-scaffold.
disable-model-invocation: true
---
# create-project

## Передумови

- Команда `git-init` завершилася успішно.
- Поточний каталог є коренем Git-репозиторію.
- Node.js доступний і має версію не нижче 20. Якщо `node` відсутній або версія нижча, зупиніться й нічого не завантажуйте.

## Дії

1. Виконайте `node -v` і перевірте major-версію `>= 20`.
2. Прочитайте `.github/skills/project-scaffold/SKILL.md` і виконайте його розділ **«Що створити»** з параметрами: мова `JavaScript`, назва `hello`.
3. Виконайте перевірки з цього skill і покажіть їхній результат.

## Очікувані файли

- `src/hello.js` з Hello World.
- Каталоги `src/`, `tests/`, `docs/` за потреби.
- `.gitignore` з правилами skill.
- `package.json`, тести та CI-скрипти на цьому кроці не створюються.

## Команди перевірки

```text
node -v
node src/hello.js
git check-ignore build/ node_modules/
```

## Повідомлення про помилку

Формат: `create-project FAILED: <причина>`. Якщо Node.js відсутній, не встановлюйте його та не завантажуйте залежності.

## Повторний запуск

Ідемпотентність: не перезаписує правильні файли, не руйнує каркас, не дублює рядки `.gitignore` і конфігурації.
