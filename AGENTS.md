<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Clean Code & Clean Architecture Standards

Ensure the application code adheres to standard Clean Code and Clean Architecture practices. Follow these rules for all development within this codebase:

## 1. Clean Architecture Structure (Separation of Concerns)

Keep business logic separate from framework details (Next.js components, page routes, and third-party APIs). Structure application features into three main layers:

- **Presentation Layer (`src/components`, `src/app`)**:
  - Handles UI components and pages.
  - Keeps React Server Components (RSC) default; use `"use client"` only for components requiring interactivity, hooks (`useState`, `useEffect`), or context.
  - UI components should be purely focused on presentation and state rendering. Do not inline database calls or heavy business validation inside UI elements.
  - Extract reusable blocks into logical atomic components.

- **Domain/Business Logic Layer (`src/core` or `src/domain`)**:
  - Defines pure business entities, data models, rules, and validators.
  - This layer must be framework-agnostic. It should not import React, Next.js functions, or specific database clients.
  - Contains pure functions that are easy to test.

- **Infrastructure/Data Layer (`src/infrastructure`, `src/services`, `src/repositories`)**:
  - Handles data access (fetching, caching, external APIs, backend integration).
  - Implements repositories or service classes to abstract database/network interfaces.
  - Presentation layer talks to domain models and services, not directly to raw databases or APIs.

## 2. Clean Code Principles

- **Single Responsibility Principle (SRP)**:
  - Every component, file, function, or hook should have only one reason to change.
  - Functions should perform one single operation. If a function is doing multiple tasks, split them into helper functions.
- **Explicit and Self-Documenting Naming**:
  - Write variable, function, and class names that explicitly describe their intent (e.g. `useWeddingInvitationState` instead of `useInvState`).
  - Do not use magic numbers or hardcoded values; define constants with readable uppercase names.
- **Strict Typing**:
  - No `any` type usage. Declare explicit interfaces and types for props, API responses, and database schemas.
  - Prefer TypeScript discards (`unknown`) or specific union types over loose typing.
- **Immutability**:
  - Keep states immutable. Prefer `const` over `let` unless local reassignments are strictly necessary.
- **Robust Error Handling**:
  - Use structured try-catch blocks in servers, API calls, and handlers.
  - Implement fallback UI states for error conditions. Use Next.js `error.tsx` file boundaries when necessary.

## 3. Formatting & Linting Rules

- Follow standard formatting and spacing rules consistently.
- Avoid nesting code too deeply (prefer guard clauses and early returns).
- Keep component and file sizes small (ideally under 150-200 lines). If a file exceeds this, split it into subcomponents or utility modules.

