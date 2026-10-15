---
description: "Створює workflow GitHub Actions через skill github-actions після локальної збірки."
agent: build-engineer
---

# create-actions

## Передумови

- Локальна збірка завершилася рядком `CI OK`.
- Існують і працюють `ci.sh` та `ci.bat`.

## Дії

1. Прочитайте `.github/skills/github-actions/SKILL.md` і виконайте його розділ **«Що створити»**.
2. Виконайте YAML-перевірку, визначену цим skill, і покажіть її повний результат.

## Очікувані файли

- `.github/workflows/ci.yml` з однією job і matrix для Ubuntu, Windows та macOS.
- Workflow запускає лише відповідні локальні `bash ci.sh` або `ci.bat`.

## Команди перевірки

```text
node -e "const y=require('yaml');const d=y.parse(require('fs').readFileSync('.github/workflows/ci.yml','utf8'));console.log(d.jobs.build.strategy.matrix.os.join(','))"
```

Очікувано: `ubuntu-latest,windows-latest,macos-latest`.

## Повідомлення про помилку

Формат: `create-actions FAILED: <причина>`. Не перезаписуйте неправильний workflow мовчки й не додавайте обхідні кроки збірки.

## Повторний запуск

Ідемпотентність: не руйнує правильний workflow, не дублює job, кроки чи конфігурації.
