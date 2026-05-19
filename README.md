# CMS Landing Gulp Starter

Обновлённая сборка под лендинг: `Gulp + BrowserSync + SCSS + Nunjucks`. Верхушка вынесена блочно: layout, head, header, hero, footer. Hero-секция и шапка сделаны ближе к переданному референсу, с плейсхолдерами вместо недостающей графики.

## Старт

```bash
npm i
npm run dev
```

Продакшен-сборка:

```bash
npm run build
```

## Структура шаблонов

```text
src/pages/index.njk                 # страница
src/templates/layouts/base.njk      # базовый layout
src/templates/partials/head.njk     # head
src/templates/partials/header.njk   # шапка
src/templates/sections/hero.njk     # hero-блок
src/templates/partials/footer.njk   # footer-заглушка
```

Gulp собирает только `src/pages/**/*.njk` в `dist/*.html`. Частичные шаблоны лежат отдельно и напрямую в `dist` не попадают.

## Стили

```text
src/scss/main.scss
src/scss/abstracts/_tokens.scss
src/scss/base/_fonts.scss
src/scss/base/_reset.scss
src/scss/base/_global.scss
src/scss/layout/_container.scss
src/scss/blocks/_header.scss
src/scss/blocks/_hero.scss
src/scss/blocks/_button.scss
```

## Подключение шрифта

Файлы шрифта положи сюда:

```text
src/assets/fonts/
```

Например:

```text
src/assets/fonts/project-font.woff2
src/assets/fonts/project-font.woff
```

После этого открой `src/scss/base/_fonts.scss`, раскомментируй `@font-face` и замени имя/пути, если нужно. Основная переменная шрифта находится в `src/scss/abstracts/_tokens.scss`:

```scss
--font-main: "ProjectFont", Arial, Helvetica, sans-serif;
```

Чтобы заменить на свой шрифт, поменяй `ProjectFont` в `@font-face` и в переменной `--font-main` на одно и то же название.

## CMS-подход

Блоки помечены `data-cms-block`, редактируемые поля — `data-cms-field`. Верхушка сейчас нарезана так, чтобы её можно было отдельно переносить в CMS:

- `header`
- `hero`
- `placeholder-about` — временная заглушка под следующие секции
- `footer` — заглушка

Меню пока якорное. Неподключенные якоря можно оставить как есть и потом привязать к будущим секциям.
