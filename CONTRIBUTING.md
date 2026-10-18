# Contributing to Toolsy

Thanks for helping improve Toolsy. This guide covers how to report issues, propose changes, and open pull requests. By participating, you agree to keep discussions respectful and focused on the project.

---

## Table of contents

1. [Ways to contribute](#ways-to-contribute)
2. [Before you start](#before-you-start)
3. [Development setup](#development-setup)
4. [Branching and commits](#branching-and-commits)
5. [Pull requests](#pull-requests)
6. [Coding guidelines](#coding-guidelines)
7. [Testing](#testing)
8. [Issue triage](#issue-triage)
9. [What we are not looking for (right now)](#what-we-are-not-looking-for-right-now)

---

## Ways to contribute

- **Bug reports** — clear reproduction steps, OS, and Toolsy / commit version  
- **Feature ideas** — problem statement first; proposed UX second  
- **Code** — bug fixes, docs, tests, and scoped features that match the roadmap  
- **Documentation** — README, CONTRIBUTING, comments, and developer notes  
- **QA** — smoke tests on Windows, Linux, or Intel Mac are especially valuable during the Tauri migration  

---

## Before you start

1. Search [existing issues](https://github.com/K35P/toolsy/issues) and pull requests to avoid duplicates.  
2. For non-trivial work, **open an issue first** so maintainers can confirm direction.  
3. Read the [README](README.md) for stack, status, and setup prerequisites.  
4. Use **`pnpm tauri:dev`** for day-to-day work. The app is Tauri-only.

---

## Development setup

```sh
git clone https://github.com/K35P/toolsy.git
cd toolsy
pnpm install --frozen-lockfile
pnpm tauri:dev
```

See the README for Node, pnpm, Rust, and OS-specific dependencies (including dav1d for AVIF).

Useful commands:

| Command | Purpose |
|---------|---------|
| `pnpm tauri:dev` | Run the desktop app in development |
| `pnpm build:web` | Typecheck + Vite frontend production build |
| `pnpm test` | Rust unit tests in `src-tauri` |
| `pnpm tauri:build` | Native release bundle (heavy; use when needed) |

Keep the working tree clean of large artifacts (`src-tauri/target`, `dist`, `release`) unless you intentionally need them locally. Do not commit build outputs.

---

## Branching and commits

1. Fork the repository (or create a branch if you have write access).  
2. Create a topic branch from `main`:

   ```sh
   git checkout main
   git pull origin main
   git checkout -b feat/short-description
   ```

   Suggested prefixes: `feat/`, `fix/`, `docs/`, `chore/`, `test/`, `refactor/`.

3. Keep commits focused. Prefer clear messages that explain **why**:

   ```text
   fix: reject conversion paths outside the output folder

   Canonicalize paths before delete/open so traversal cannot escape
   the managed conversions directory.
   ```

4. Do **not** force-push shared branches. Do **not** commit secrets, credentials, or personal machine paths.

---

## Pull requests

### Checklist before opening a PR

- [ ] Branch is up to date with `main` (rebase or merge as appropriate)  
- [ ] Change is scoped — one concern per PR when possible  
- [ ] UI and copy touched by the change still make sense  
- [ ] `pnpm build:web` succeeds for frontend changes  
- [ ] `pnpm test` succeeds for Rust / conversion / settings changes  
- [ ] No unrelated formatting churn or generated noise  
- [ ] Docs updated if behavior or setup changed  

### Opening the PR

1. Push your branch to your fork (or the remote).  
2. Open a pull request against `main` on [K35P/toolsy](https://github.com/K35P/toolsy).  
3. Fill in:

   - **Summary** — what changed and why  
   - **Test plan** — commands run and manual checks (OS matters for desktop)  
   - **Screenshots / recordings** — for UI changes  
   - **Related issues** — e.g. `Closes #123`  

4. Keep the PR description updated if you add commits during review.  
5. Respond to review comments; mark conversations resolved when addressed.  
6. Maintainers may ask for squashes or small follow-ups before merge.

### Review expectations

- PRs that change native security boundaries (FS, dialogs, opener, IPC) get extra scrutiny.  
- Do not reintroduce Electron or other dual-runtime shells without an agreed design discussion.  
- Large refactors without behavior change should be separated from feature PRs.

---

## Coding guidelines

- **Language:** use **English** for code comments, commit messages, PR text, docs, and user-facing strings when adding or editing them.  
- **Frontend:** React + TypeScript; prefer the shared `desktopApi` adapter (`src/api/desktop.ts`) instead of calling Tauri APIs ad hoc from components.  
- **Backend:** Rust commands in `src-tauri`; keep path validation when touching files under the conversions directory.  
- **Style:** match existing patterns; do not mass-reformat unrelated files.  
- **Comments:** only where the intent is non-obvious; keep them precise and in English.  
- **Dependencies:** justify new crates or npm packages in the PR; prefer small, maintained libraries.

---

## Testing

Minimum expectations by change type:

| Change | At least |
|--------|----------|
| Rust conversion / decode | `pnpm test` |
| Settings / FS commands | `pnpm test` + manual smoke of Settings / My Files |
| UI only | Manual check in `pnpm tauri:dev` |
| Packaging / CI | Note what you could not run locally (e.g. Windows from macOS) |

Manual smoke (short):

1. Select an image and convert to at least one format.  
2. Confirm the file appears under My Files.  
3. Change or reset the output folder in Settings.  
4. Confirm window controls / drag region still work on your OS.

---

## Issue triage

When filing a bug, include:

- OS and architecture (e.g. macOS 15 arm64, Windows 11 x64)  
- Toolsy version or git commit  
- Steps to reproduce  
- Expected vs actual behavior  
- Logs or screenshots if available  

Label suggestions (maintainers may adjust): `bug`, `enhancement`, `docs`, `qa`, `migration`.

---

## What we are not looking for (right now)

To keep the project focused:

- Reintroducing **Electron** or a second desktop shell without maintainer agreement  
- A full **auto-updater** without a real update endpoint and signing plan  
- Cloud sync, accounts, or remote conversion backends that break the local-first model  
- Drive-by dependency upgrades with no clear benefit  

If you are unsure, open an issue and ask.

---

## License

By contributing, you agree that your contributions are licensed under the same [MIT License](LICENSE) that covers the project.

Questions? Open a GitHub issue or discussion on the repository.
