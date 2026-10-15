---
name: build-and-test
description: "Налаштовує Jest, функцію add, npm manifest і локальні кросплатформні CI-скрипти для наявного src/hello.js; застосовувати для побудови та тестування JavaScript-проєкту."
---

# build-and-test

## Призначення

Додати до готового `src/hello.js` тестування Jest, npm-конфігурацію та локальні скрипти, які тестують і збирають виконуваний Hello World через `@yao-pkg/pkg`.

## Коли застосовувати

Застосовуйте після `project-scaffold`, коли `src/hello.js` уже існує і локальна команда `node src/hello.js` друкує `Hello, World!`.

## Вхідні дані

- Наявний `src/hello.js`.
- Корінь репозиторію є поточним робочим каталогом.
- Node.js версії 20 або новішої та npm доступні локально.

## Що створити

Перед створенням кожного файлу перевірте його існування. Правильні файли не перезаписуйте, неправильні не виправляйте мовчки: повідомте про розбіжність. Каталоги `scripts/` і `build/` створюйте лише за відсутності. Усі зміни мають бути ідемпотентними.

### `src/add.js`

```js
function add(a, b) {
  return a + b;
}

module.exports = { add };
```

### `tests/basic-addition.test.js`

```js
const { add } = require("../src/add");

test("BasicAddition", () => {
  expect(add(2, 3)).toBe(5);
});
```

### `package.json`

Якщо `package.json` відсутній, створіть його з цим точним вмістом:

```json
{
  "name": "hello",
  "version": "1.0.0",
  "private": true,
  "main": "src/hello.js",
  "bin": "src/hello.js",
  "engines": {
    "node": ">=20"
  },
  "scripts": {
    "start": "node src/hello.js",
    "test": "jest --verbose",
    "build": "pkg . --targets host --output build/hello",
    "check": "node scripts/check.js"
  },
  "jest": {
    "testEnvironment": "node"
  },
  "devDependencies": {
    "@yao-pkg/pkg": "*",
    "jest": "*",
    "yaml": "*"
  }
}
```

Якщо файл існує, збережіть правильні наявні поля й додайте лише відсутні потрібні поля без дублювання; не перезаписуйте правильні значення. Встановіть залежності тільки локально:

```text
npm install --save-dev jest @yao-pkg/pkg yaml
```

Ніколи не використовуйте `npm install -g`. Після першого `npm install` перевірте `package-lock.json` і додайте його до коміту користувача; цей skill сам не виконує `git commit`.

### `.gitattributes`

Якщо файл відсутній, створіть його з точним вмістом; якщо існує, додайте лише відсутні рядки:

```text
* text=auto eol=lf
*.bat text eol=crlf
```

### `ci.sh`

Файл має бути з LF. Якщо його немає, створіть точний вміст і зробіть виконуваним:

```bash
#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"
npm ci
npm test
npm run build

output="$(./build/hello)"
if [ "$output" != "Hello, World!" ]; then
  echo "Unexpected output: $output" >&2
  exit 1
fi

echo "CI OK"
```

### `ci.bat`

Файл має бути з CRLF. Якщо його немає, створіть точний вміст:

```bat
@echo off
rem Run all npm commands with call so this batch file continues.
cd /d "%~dp0"
call npm ci || exit /b 1
call npm test || exit /b 1
call npm run build || exit /b 1

set "OUTPUT="
for /f "delims=" %%L in ('build\hello.exe') do set "OUTPUT=%%L"
if not "%OUTPUT%"=="Hello, World!" exit /b 1

echo CI OK
```

Поясніть користувачу: без `call` batch-скрипт завершиться після першої команди `npm`, тому наступні кроки не виконаються.

Примітка: під час першої збірки `pkg` завантажує базовий Node-бінарник у кеш користувача, а не в репозиторій; це дозволено.

## Результати

Мають існувати `src/add.js`, `tests/basic-addition.test.js`, `package.json`, `package-lock.json`, `.gitattributes`, `ci.sh` і `ci.bat`. Локальна збірка має створювати `build/hello` або `build/hello.exe`; каталог `build/` не можна додавати до Git.

## Перевірки

Виконайте відповідну команду з кореня:

```text
npm test
```

У виводі має бути `BasicAddition`.

```text
bash ci.sh
```

На Windows PowerShell:

```powershell
.\ci.bat
```

Команда має завершуватися рядком `CI OK`. Додатково перевірте виконуваний файл:

```text
./build/hello
git check-ignore build/hello
```

На Windows використовуйте `build\hello.exe`; виконуваний файл має друкувати рівно `Hello, World!`, а `git check-ignore` має надрукувати шлях.

## Що робити при помилці

Зупиніться на першій помилці, покажіть команду та stderr і виправляйте лише причину. Якщо `npm ci` не працює через відсутній `package-lock.json`, один раз виконайте `npm install`, перевірте lockfile і повторіть `npm ci`. Якщо `ci.bat` обривається після `npm ci`, додайте `call` перед кожною npm-командою. Якщо `pkg` не може завантажити базовий Node-бінарник, зупиніться та повідомте користувача; нічого не завантажуйте вручну в репозиторій.

## Приклад входу

```text
src/hello.js існує і друкує Hello, World!
```

## Очікуваний результат

```text
PASS tests/basic-addition.test.js
  ✓ BasicAddition
CI OK
```

Також створено `build/hello` на Linux/macOS або `build\hello.exe` на Windows.

## Типовий сценарій помилки

`npm ci` відмовляється через відсутній `package-lock.json`. Виконайте один раз `npm install`, переконайтеся, що lockfile створено, і повторіть перевірки. Не замінюйте `npm ci` на `npm install` у `ci.sh` або `ci.bat`.
