# CLAUDE.md

Pescare — mobile app for fishers (`FISHER` role) in the Pescare fishing-management system: sign up, record fishing trips and sales, and see the fishing bans (defesos) and alerts for their municipality. Consumes the REST API in `../pescare-backend`, the same one used by the admin panel in `../pescare-frontend`.

Who the users are, what the product must do, and its principles: `PRODUCT.md`. Read it before designing a screen.

This file follows the conventions of `../pescare-frontend/CLAUDE.md`, adapted to React Native and Expo. When a rule here and the web differ, the difference is on purpose: keep it.

Expo-specific rules (check the versioned docs before touching an Expo API, `npx expo install`, CNG, EAS): @AGENTS.md

## Development philosophy

- **Functional over OOP**: prefer functions, hooks, and composition. Do not create classes. The project uses no inheritance or instantiation.
- **SRP**: each component, hook, API file, and function does one thing only. If you need "and" to describe what it does, split it.
- **ISP**: keep interfaces and props small and specific. Avoid generic props that accumulate responsibilities.
- **DIP**: pure logic (`utils/`, helpers) receives its dependencies as parameters. The only sanctioned singletons are the axios instance (`@/lib/api-client`) and the `queryClient` (`@/lib/react-query`). Import them; never create new instances inside features.
- **KISS**: the simplest solution that solves the problem is the right one. Do not anticipate abstractions.
- **DRY**: logic duplicated in two places is a candidate for extraction. In three places, extraction is mandatory.
- **Type safety**: no `any` in API request/response types. Define them in `features/[feature]/types/`, or in `src/types/` when several features share them. `any` anywhere else requires a comment that justifies it.
- **Before generating code**: identify the correct layer (`app/`, `features/[feature]/api|components|hooks|screens|stores|types|utils`, or a shared folder), the target file, and the types involved. Only then implement.

### Components

- **Reuse first**: before creating a component, search `src/components/` and the current feature's `components/` for one that already solves the problem. Always prefer an existing component over writing new markup.
- **Build for reuse**: whenever possible, design components to be reused across the project. They are driven by props, with no hard-coded domain data, no data fetching, and no knowledge of the route they live in. Feature-specific logic stays in the parent.
- **Where they live**: reusable UI goes in `src/components/`. A component goes in `features/[feature]/components/` only when it is tied to that feature's domain. When another feature needs it, move it to `src/components/`, because features cannot import from each other.
- **Wrap recurring patterns**: patterns that repeat (form field with label + error, list with empty state, screen header, primary button) become shared components in `src/components/`. Do not repeat the same styled-components block in each feature.
- **Extend, don't copy**: if an existing component almost fits, extend it with a small, specific prop instead of creating a near-duplicate. Do not turn it into a catch-all component (ISP).
- **Composition**: routes orchestrate feature screens; feature screens compose shared components.

## Stack

- Expo SDK 57 + React Native 0.86 + React 19.2, TypeScript 6 (`strict`).
- Platforms: one Material Design app on Android and iOS (team decision, see `PRODUCT.md`). On iPhone it still honors safe-area insets, Reduce Motion and edge-swipe back. Web (`react-native-web`) is only a dev preview.
- React Compiler is on (`experiments.reactCompiler` in `app.json`). It memoizes components and hooks, so do not add `useMemo`, `useCallback` or `memo` by hand unless a measured problem calls for it.
- Routing: Expo Router (file-based, `src/app/`), with typed routes (`experiments.typedRoutes`). Import `Link`, `router`, `Stack`, `Tabs` and `useLocalSearchParams` from `expo-router`. Do not install `@react-navigation/*`: Expo Router 57 bundles its own copy.
- Styling: styled-components 6 (`styled-components/native`), with the theme in `src/theme/theme.ts` and its typing in `src/theme/style.d.ts` (`DefaultTheme`). Colors, spacing and font sizes come from the theme, never as literals in components. A new token goes in both files.
- Images: `expo-image` (`Image`), not React Native's `Image`.
- Server state: TanStack Query 5, with the single `queryClient` in `src/lib/react-query.ts` (refetch on app focus via `AppState`, online state via NetInfo).
- HTTP: axios, through a single instance in `src/lib/api-client.ts`.
- Client state: Zustand. **Not installed yet.** Add it when the first global client state appears. Do not use Context for global state, and never copy server data into a store, because that belongs to TanStack Query. Today three places use React Context anyway (see "Current state").
- Forms: react-hook-form + zod 3 (`@hookform/resolvers/zod`), the same as the web. **Not installed yet.** The backend uses zod 4, so schemas are not shared: redefine them here. Today the forms use `useState` plus validators in `utils/` (e.g. `features/fishing-records/utils/validate-fishing-record.ts`).
- Session token: `expo-secure-store`. See "Current state".
- Add any dependency with `npx expo install <package>`, never `npm i`, so the version matches the SDK.
- Backend contract (`../pescare-backend`): Express, routes under `/api/v1`, JWT auth (`POST /auth/sign-in` → `{ token, user }`, sent as `Authorization: Bearer <token>`, expires in 1 day), roles `ADMIN` | `FISHER`. Errors come as `{ message, issues?: { path, message }[] }`; show `message` to the user. Fields are snake_case (`main_name`, `is_active`, `fk_municipality_ibge_code`). Keep them as-is in API types and do not rename them.

## Structure

Feature-based architecture (Bulletproof React), the same as the web. Path aliases: `@/` → `src/`, `@/assets/` → `assets/`.

```
src/
  app/             # Expo Router: every file is a route, every _layout.tsx is a navigator
    _layout.tsx    # root Stack + providers (Theme, QueryClient, Auth) + Stack.Protected guards
    index.tsx      # welcome screen (signed out)
    sign-in.tsx
    sign-up/       # sign-up, one field per step
    (drawer)/      # signed-in area with the side menu (Início, Histórico, Minha produção, REAP, ...)
    fishing-records/ # new record flow (new/) and record detail ([recordId].tsx)
    account/       # profile edits opened from Perfil (name, city, password)
  features/
    [feature]/     # auth, alerts, fishing-bans, fishing-records, sales, profile, ...
      api/         # one file per endpoint: request fn + queryOptions + hook
      components/  # components exclusive to this feature
      hooks/       # feature hooks not tied to a single endpoint
      screens/     # one screen per route (`*-screen.tsx`); the route file in src/app renders it
      stores/      # Zustand stores of this feature
      types/       # API request/response and domain types
      utils/       # pure helpers of this feature
  components/      # shared UI components (used by 2+ features)
  hooks/           # shared hooks
  lib/             # preconfigured libraries (api-client.ts, react-query.ts, auth-token.ts)
  stores/          # global Zustand stores
  theme/           # styled-components theme and its typing
  types/           # shared types
  utils/           # shared pure helpers
  config/          # env/config (read `process.env.EXPO_PUBLIC_*` only here)
assets/            # static files, at the project root because app.json points to them
```

Only create the folders and subfolders that are actually needed.

### Routes (`src/app/`)

- Everything in `src/app/` becomes a route. Only route files and `_layout.tsx` go there. Components, hooks and helpers never do.
- A route file is thin: it renders the feature's screen. When a screen needs data from two features, the route file composes them (calls each feature's hook and passes the results as props). That is the mobile equivalent of the web's `app/routes/`.

  ```tsx
  // src/app/(tabs)/fishing-bans.tsx
  import { FishingBansScreen } from '@/features/fishing-bans/screens/fishing-bans-screen'

  export default FishingBansScreen
  ```

- Route files are named in English kebab-case (`fishing-bans.tsx`), like any other file. A dynamic segment is the param name read by `useLocalSearchParams`, so it is camelCase (`records/[recordId].tsx`), like the web's `:periodId`. The web uses pt-BR URLs (`/entrar`) because the address bar shows them. In the app the path is not shown to the user, so this rule does not apply here.
- Each screen sets its own header title with `<Stack.Screen options={{ title: 'Defesos' }} />`. This is the web page's `<title>` equivalent.
- Authentication uses `Stack.Protected guard={...}` in the layout, not redirects scattered across screens.

### Import rules (enforced by ESLint `import/no-restricted-paths`)

- A feature never imports from another feature. When two features must interact, compose them in the route file in `src/app/`.
- `features/` never imports from `app/`.
- Shared folders (`components`, `hooks`, `lib`, `stores`, `theme`, `types`, `utils`, `config`) never import from `features/` or `app/`.
- Code flows one way: shared → features → app.
- Use the `@/` alias for imports outside the current folder. Import files directly, and do not create barrel `index.ts` files.
- `eslint.config.js` builds the per-feature zones from the folders in `src/features/`, so a new feature is isolated as soon as its folder exists. The web keeps that list by hand. The TypeScript resolver set there is what lets the rule see `@/` imports; do not remove it.

### API files

One file per endpoint, named by action: `get-fishing-bans-in-effect.ts`, `get-alerts.ts`, `get-alert-by-id.ts`. Each file contains:

```ts
// features/fishing-bans/api/get-fishing-bans-in-effect.ts
export const getFishingBansInEffect = (): Promise<FishingBanPeriod[]> =>
  api.get('/fishing-ban-periods/in-effect')

export const getFishingBansInEffectQueryOptions = () =>
  queryOptions({ queryKey: ['fishing-ban-periods', 'in-effect'], queryFn: getFishingBansInEffect })

export const useFishingBansInEffect = () => useQuery(getFishingBansInEffectQueryOptions())
```

- Query keys: `['<resource>']` for lists, `['<resource>', id]` for a single item.
- Mutations invalidate the related query keys in `onSuccess`.
- Decision rule: if it calls a React hook, it is a hook (`use...`) and lives in the API file or in `hooks/`. If it is a pure function with no React, it goes in `utils/`.

## Commands

### Prerequisites to run locally

- Node + npm. A phone with Expo Go, an Android emulator, or an iOS simulator.
- Backend running from `../pescare-backend`, the same way as for the web: PostgreSQL with the schema in `../pescareSQL_v1.sql`, then `npm run seed-municipalities` and `npm run dev` (port 3000).
- `.env` is optional. Without `EXPO_PUBLIC_API_URL`, `src/config/env.ts` uses the IP of the machine running `expo start`, on port 3000, which the emulator and a phone on the same network already reach. To point elsewhere, copy `.env.example`. When setting it by hand: `localhost` only works on web and the iOS simulator. The Android emulator uses `http://10.0.2.2:3000/api/v1`, and a physical phone uses the computer's LAN IP (`http://192.168.x.x:3000/api/v1`).

### Inside pescare-mobile

- `npm install`: install dependencies.
- `npx expo start`: dev server (Metro) on port 8081. Use `npm run android`, `npm run ios` or `npm run web` to open a target directly.
- `npx expo start --clear`: restart with a clean cache. Required after installing packages or changing `package.json`, `app.json` or `.env`. A server started before such a change keeps the old config and can fail with `ConfigError: Cannot resolve entry file`.
- `npx tsc --noEmit`: type check. Typed routes are generated by the dev server, so start it once after creating a route.
- `npm run lint`: ESLint (`expo lint`, `eslint-config-expo` + the import rules).
- `npm run format`: Prettier write. Check only: `npx prettier --check .`.
- `npx expo-doctor`: dependency and config diagnosis.
- `npx expo install <package>`: add a dependency at the SDK-compatible version.

Run the type check and lint before declaring any task done.

## Code style

- Functions: preferably 4-30 lines. Split if longer.
- Files: preferably under 500 lines. Split by responsibility.
- One thing per function, one responsibility per module (SRP).
- Names: specific and unique. Avoid `data`, `handler`, `Manager`.
  Prefer names that return <5 grep hits in the codebase.
- Types: explicit. No `any` and no untyped functions.
- No code duplication. Extract shared logic into a function/module.
- Early returns over nested ifs. Max 2 levels of indentation.
- Exception messages must include the offending value and the expected shape.

## Naming conventions

- **PascalCase**: components (`FishingBanCard`) and types/interfaces (`FishingRecordFormValues`). Do not use the `T` suffix.
- **kebab-case**: all directory and file names, including components and routes (`fishing-ban-card.tsx` exports `FishingBanCard`, `use-alert-filter.ts`, `get-alerts.ts`). Expo Router's special names keep their syntax: `_layout.tsx`, `(group)/`, `[param].tsx`, `+not-found.tsx`.
- **camelCase**: variables, functions, methods, and props.
- Prefix `handle` on event handlers: `handlePress`, `handleFormSubmit`.
- Prefix `is/has/can` on booleans, always with context in the name: `isAlertsLoading`, `hasFormError`. Never just `isLoading`.
- Prefix `use` on custom hooks: mandatory. Any function that calls hooks internally must start with `use`.
- Styled components get a name that says what they are in the screen (`ScreenContainer`, `RecordTitle`), declared above the component that uses them.

## Language

- Comments and UI strings: pt-BR.
- Variable/function/file/folder names: English (standard for code).

## Comments

- JSDoc (`/** ... */`) is required on all exported functions in `features/*/api/`, `hooks/`, `utils/`, and `lib/`.
- Include a one-line intent, `@param` for non-obvious parameters, and `@returns` when the return value needs context.
- Do not use JSDoc on React components. Document complex props with inline TypeScript comments instead.
- Keep your own comments. Don't strip them on refactor: they carry intent and provenance.
- Write WHY, not WHAT. Skip `// increment counter` above `i++`.
- Docstrings on public functions: intent + one usage example.
- Reference issue numbers / commit SHAs when a line exists because of a specific bug or upstream constraint.

## Formatting

- Prettier with the repo's `.prettierrc`, the same as the web's: no semicolons, single quotes, trailing commas, `printWidth: 100`. Don't discuss style beyond that.
- `.prettierignore` leaves out the lockfile, `assets/` and third-party tool folders (`.claude/`, `.impeccable/`).

## Logging

- `console.error` for caught exceptions, always with context (`console.error('Sign-in error:', error)`).
- `console.warn` for non-fatal situations (e.g. timeouts, activated fallbacks).
- Use a bracketed prefix to identify the source: `console.warn('[api] token expirado — redirecionando para login')`.
- The logs show up in the terminal running `expo start`.
- No structured logging infra exists yet. Do not introduce one without a team decision.

## Accessibility

- Pair every icon with a text label. An icon alone is not enough for this audience (`PRODUCT.md`).
- Every custom touchable has an `accessibilityRole` (`button`, `link`, `checkbox`, ...), and an `accessibilityLabel` when its text does not say what it does.
- Touch targets are at least 48×48 dp (Material). Use `hitSlop` when the visual element is smaller.
- Screens respect safe-area insets (`react-native-safe-area-context`). Animations respect Reduce Motion (Reanimated's `useReducedMotion`).
- Do not disable font scaling (`allowFontScaling={false}`). Layouts must hold up with the system's large text.
- Use `accessibilityRole="header"` on screen and section titles, in order.
- Form errors appear as text next to their field, not only as a color change, and the field's `accessibilityHint` includes the error.
- Text and theme colors keep AA contrast (4.5:1 for body text).

## Response

- Always reply to the user in Portuguese (pt-BR).
