---
name: github-actions
description: "Створює ідемпотентний workflow GitHub Actions для локальних ci.sh і ci.bat на Ubuntu, Windows та macOS; застосовувати після успішних локальних CI-перевірок."
---

# github-actions

## Призначення

Додати workflow `.github/workflows/ci.yml`, який запускає вже наявні локальні CI-скрипти на трьох операційних системах і завантажує створений executable як artifact.

## Коли застосовувати

Застосовуйте лише після того, як `ci.sh` і `ci.bat` локально завершуються рядком `CI OK`.

## Вхідні дані

- Наявний і перевірений `ci.sh`.
- Наявний і перевірений `ci.bat`.
- Коренем роботи є корінь репозиторію.

## Що створити

Перед створенням перевірте існування `.github/workflows/ci.yml`. Якщо файл уже правильний, не перезаписуйте його. Якщо файл відсутній, створіть каталоги та файл із точним вмістом нижче. Якщо наявний файл неправильний, повідомте про розбіжності замість мовчазного перезапису.

### `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [develop, master]
  pull_request:
    branches: [develop, master]

permissions:
  contents: read

jobs:
  build:
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Build and test (Linux/macOS)
        if: runner.os != 'Windows'
        shell: bash
        run: bash ci.sh
      - name: Build and test (Windows)
        if: runner.os == 'Windows'
        shell: cmd
        run: ci.bat
      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: hello-${{ matrix.os }}
          path: build/hello*
          if-no-files-found: error
```

Workflow має лише запускати `bash ci.sh` або `ci.bat`. Не додавайте кроків `npm install`, `npm test`, `setup-node` чи інших кроків збірки. Секрети та їхні значення не додавайте.

## Результати

Один job `build` запускається для `ubuntu-latest`, `windows-latest` і `macos-latest`, виконує відповідний локальний CI-скрипт і створює artifact `hello-<os>` для кожної ОС.

## Перевірки

Перевірте YAML і matrix цією точною командою:

```text
node -e "const y=require('yaml');const d=y.parse(require('fs').readFileSync('.github/workflows/ci.yml','utf8'));console.log(d.jobs.build.strategy.matrix.os.join(','))"
```

Команда має надрукувати:

```text
ubuntu-latest,windows-latest,macos-latest
```

Після push перевірте вкладку Actions: мають бути три зелені job і три artifacts `hello-<os>`.

## Що робити при помилці

Якщо Linux/macOS отримує `Permission denied` для `ci.sh`, залиште workflow із запуском через `bash ci.sh`, а не прямим `./ci.sh`, і перевірте сам скрипт. Якщо workflow не стартує, перевірте секцію `on`, події `push` і `pull_request`, а також назви гілок `develop` і `master`. Не додавайте обхідні кроки встановлення чи збірки у workflow.

## Приклад входу

```text
ci.sh -> CI OK
ci.bat -> CI OK
```

## Очікуваний результат

```text
ubuntu-latest,windows-latest,macos-latest
```

У GitHub Actions після push є три успішні job і artifacts `hello-ubuntu-latest`, `hello-windows-latest`, `hello-macos-latest`.

## Типовий сценарій помилки

Job на Linux/macOS падає з `Permission denied`, коли workflow намагається виконати `./ci.sh`. Запускайте скрипт саме як `bash ci.sh`; workflow уже містить цей безпечний спосіб запуску.
