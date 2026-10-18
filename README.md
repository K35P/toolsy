# Toolsy

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Tauri](https://img.shields.io/badge/Tauri-2.x-24C8DB?logo=tauri&logoColor=white)](https://tauri.app/)
[![pnpm](https://img.shields.io/badge/pnpm-11.25-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Continuous build](https://img.shields.io/github/v/release/K35P/toolsy?include_prereleases&label=download)](https://github.com/K35P/toolsy/releases/tag/continuous)

**Local-first desktop app for fast, private image conversions.**

Toolsy runs on your machine. Files never leave your computer for conversion — no cloud upload, no account required.

## Download

| | Installer |
|---|-----------|
| **macOS** (Apple Silicon) | [`.dmg`](https://github.com/K35P/toolsy/releases/download/continuous/toolsy-macos-latest-Toolsy_1.0.0_aarch64.dmg) |
| **Windows** | [Setup `.exe`](https://github.com/K35P/toolsy/releases/download/continuous/toolsy-windows-latest-Toolsy_1.0.0_x64-setup.exe) · [`.msi`](https://github.com/K35P/toolsy/releases/download/continuous/toolsy-windows-latest-Toolsy_1.0.0_x64_en-US.msi) · [`dav1d.dll`](https://github.com/K35P/toolsy/releases/download/continuous/toolsy-windows-latest-dav1d.dll) (keep next to the app if AVIF fails to load) |
| **Linux** | [`.AppImage`](https://github.com/K35P/toolsy/releases/download/continuous/toolsy-ubuntu-24.04-Toolsy_1.0.0_amd64.AppImage) · [`.deb`](https://github.com/K35P/toolsy/releases/download/continuous/toolsy-ubuntu-24.04-Toolsy_1.0.0_amd64.deb) · [`.rpm`](https://github.com/K35P/toolsy/releases/download/continuous/toolsy-ubuntu-24.04-Toolsy-1.0.0-1.x86_64.rpm) |

More assets: **[continuous release](https://github.com/K35P/toolsy/releases/tag/continuous)**

### macOS install

Builds use **ad-hoc signing** (not Apple Developer ID / notarized). After downloading the `.dmg`:

1. Open the disk image and drag **Toolsy** onto **Applications**.
2. First launch: right-click **Toolsy** → **Open** → confirm. Or allow it under **System Settings → Privacy & Security**.

If macOS still blocks it:

```bash
xattr -cr /Applications/Toolsy.app
```

> **Status:** active development. Desktop shell is **Tauri 2** (Rust + system WebView). Packaging, multi-platform QA, and signing are still evolving.

---

## Why Toolsy?

| Goal | What that means |
|------|-----------------|
| **Privacy** | Conversions happen locally. Nothing is sent to a remote API for processing. |
| **Speed** | Native dialogs and a Rust image pipeline keep the UI responsive for everyday files. |
| **Simplicity** | Pick a file, choose a format, convert. Browse results in **My Files**. |
| **Ownership** | MIT-licensed. Self-hosted on your desktop — your settings, your output folder. |

Longer term, Toolsy aims to grow into a small toolkit for local file & image utilities while staying lightweight and offline-first.

---

## Features

- **Image conversion** to JPEG, PNG, WebP, AVIF, and TIFF
- **Quality control** for JPEG, WebP, AVIF, and TIFF (PNG stays lossless)
- **SVG input** rasterized locally (rejected above a 100 megapixel safety limit)
- **Native file / folder dialogs**
- **My Files** — list, open, and delete converted outputs
- **Custom output directory** (default: `Desktop/Toolsy Conversions`)
- **Settings persistence** (language, output path, side panel state)
- **Frameless desktop window** with platform-appropriate chrome

### Supported formats

| Direction | Formats |
|-----------|---------|
| **Input** | JPEG, PNG, WebP, AVIF, TIFF, SVG (static) |
| **Output** | JPEG, PNG, WebP, AVIF, TIFF |

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Desktop shell | [Tauri 2](https://tauri.app/) |
| Native backend | Rust (image encode/decode, FS, settings) |
| UI | React 18, TypeScript, Vite, Tailwind CSS |
| Package manager | pnpm |

App identifier: `com.k35p.toolsy`

---

## Project status

Toolsy is **evolving**. Core product flows (convert, files, settings, window controls) run on Tauri. Still in progress:

- Full smoke QA on Windows, Linux, and Intel Mac hardware
- Distributable installers, code signing, and notarization
- Broader file-tool features beyond images

See [CHANGELOG.md](CHANGELOG.md) for recent changes. Auto-update is **not** included in the current roadmap.

---

## Prerequisites

- **Node.js** ≥ 20.19  
- **pnpm** 11.25.0 (see `packageManager` in `package.json`)  
- **Rust** stable (1.90+ recommended for current Tauri desktop plugins)  
- Platform toolchains:
  - **macOS:** Xcode Command Line Tools  
  - **Windows:** [WebView2](https://developer.microsoft.com/microsoft-edge/webview2/) + MSVC build tools  
  - **Linux:** WebKitGTK and other [Tauri Linux dependencies](https://v2.tauri.app/start/prerequisites/)

### AVIF / dav1d

AVIF decoding uses **dav1d**:

- **macOS / Linux:** `pkg-config`, Python, Meson, and Ninja (dav1d is built statically). NASM is needed for x86_64 Linux and Intel Mac builds.  
- **Windows:** `pkg-config` and dav1d via vcpkg, e.g. `vcpkg install dav1d:x64-windows`

---

## Getting started

```sh
git clone https://github.com/K35P/toolsy.git
cd toolsy
pnpm install --frozen-lockfile
pnpm tauri:dev
```

Useful scripts:

| Command | Description |
|---------|-------------|
| `pnpm tauri:dev` | Dev app with hot reload (Tauri + Vite) |
| `pnpm tauri:build` | Production native bundle for the current OS |
| `pnpm build` | Frontend build + Tauri production bundle |
| `pnpm build:web` | Frontend-only production build |
| `pnpm test` | Rust unit tests (`cargo test` in `src-tauri`) |

Build artifacts land under `src-tauri/target/release/bundle`.

> Do not ship public binaries until you have smoke-tested the target OS and completed signing / notarization where required.

---

## Settings location

| OS | Path |
|----|------|
| macOS | `~/Library/Application Support/com.k35p.toolsy/settings.json` |
| Windows | `%APPDATA%\com.k35p.toolsy\settings.json` |
| Linux | `~/.local/share/com.k35p.toolsy/settings.json` |

On first launch, if settings are missing, Toolsy may import a one-shot copy from a legacy Electron-era path (`Toolsy/settings.json` under the user config directory). The legacy file is not deleted.

---

## Contributing

Contributions are welcome. Please read **[CONTRIBUTING.md](CONTRIBUTING.md)** for bug reports, PR workflow, and coding conventions.

---

## Security & privacy

- Conversions and file listing run **locally** through Tauri commands with path checks scoped to the conversions folder.  
- External links from the UI are restricted (e.g. project GitHub URL only).  
- Please report security-sensitive issues privately to the maintainer when possible, instead of opening a public issue with exploit details.

---

## License

Released under the [MIT License](LICENSE).

---

## Links

- Repository: [github.com/K35P/toolsy](https://github.com/K35P/toolsy)  
- Changelog: [CHANGELOG.md](CHANGELOG.md)  
- Contributing: [CONTRIBUTING.md](CONTRIBUTING.md)
