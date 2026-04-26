# AGENTS.md - Coding Guidelines for omni-site-template

This file contains essential information for AI coding agents working in this repository.

## Build/Development Commands

```bash
# Install dependencies
pnpm install

# Development server
pnpm run dev

# Production build (includes font generation)
pnpm run build

# Preview production build
pnpm run preview

# Type checking
pnpm run check
pnpm run check:watch

# Linting and formatting
pnpm run lint       # Check formatting
pnpm run format     # Fix formatting
```

## Project Overview

- **Framework**: SvelteKit 2.x with Svelte 5
- **Language**: TypeScript (strict mode)
- **Package Manager**: pnpm
- **Adapter**: @sveltejs/adapter-static
- **Styling**: CSS variables via config, TwicPics for images

## Code Style Guidelines

### Formatting (Prettier)

- Indent: 2 spaces (no tabs)
- Quotes: single
- Trailing commas: all
- Print width: 100 characters
- Svelte files use svelte parser

### TypeScript Conventions

- Use strict TypeScript configuration
- Enable `allowJs` and `checkJs` for JavaScript files
- Use ES modules (`"type": "module"`)
- Import JSON with `with { type: "json" }` assertion
- Prefer explicit types for function parameters and returns

### Svelte 5 Runes

- Use `$props()` for component props (not `export let`)
- Use `$state()` for reactive state
- Use `$derived()` for computed values
- Use `$effect()` for side effects

### Naming Conventions

- Components: PascalCase (e.g., `MyComponent.svelte`)
- Utilities: camelCase (e.g., `handleCookie.ts`)
- Routes: SvelteKit conventions (`+page.svelte`, `+layout.svelte`)
- Types/Interfaces: PascalCase with descriptive names

### Imports

- Group imports: external libraries first, then `$lib`, then relative
- Use `$lib` alias for imports from `src/lib/`
- Use type imports: `import type { Foo } from 'bar'`

### Error Handling

- Handle errors gracefully in UI components
- Use SvelteKit's `+error.svelte` for route errors
- Prefer early returns for guard clauses

## Project Structure

```
src/
  lib/           # Shared utilities, components, config
  routes/        # SvelteKit routes
    [lang]/      # Internationalized routes
static/          # Static assets
fonts-generator/ # Font generation scripts
```

## Key Dependencies

- `accomadesc`: Site state management and components
- `js-cookie`: Cookie handling
- `luxon`: Date/time handling
- `@twicpics/components`: Image optimization
- `@fontsource/*`: Self-hosted fonts

## Environment Variables

- `PRIMARY_DOMAIN`: Used for prerender origin
- `RENDER_EXTERNAL_URL`: Fallback for prerender origin

## Notes

- No test framework currently configured
- No Cursor or Copilot rules found
- Site supports i18n: en, de, pl, es, fr
- Prerendering configured for static export
- Font generation runs before build
