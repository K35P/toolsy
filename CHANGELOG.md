# Changelog

All notable changes to Toolsy are documented in this file.

The format is inspired by [Keep a Changelog](https://keepachangelog.com/), and this project aims to follow [Semantic Versioning](https://semver.org/) once public releases stabilize.

## [Unreleased]

### Added

- Continuous GitHub Release (`continuous` pre-release) published automatically on every successful push to `main`.
- Tauri 2 desktop runtime with Rust commands for local conversions, file management, and settings.
- Native image pipeline for JPEG, PNG, WebP, AVIF, and TIFF output; SVG input rasterization with a 100 megapixel safety limit.
- AVIF input decoding via dav1d; dedicated handling for JPEG-compressed TIFF produced by the app.
- Native file and folder dialogs, converted-file listing, window controls, and settings persistence under `com.k35p.toolsy`.
- Optional one-shot import of legacy Electron-era settings on first launch (legacy file is kept).
- CI workflow matrix for macOS, Windows, and Ubuntu (packaging / tests).

### Changed

- Desktop API adapter is Tauri-only (`src/api/desktop.ts`).

### Removed

- Electron main/preload process, `electron-builder`, `sharp`-based conversion path, and related Vite plugins.
- Dead updater UI (`electron-updater`), demo scripts, and Electron Playwright e2e template.

### Known gaps

- Windows / Linux / Intel Mac smoke QA, distributable installers, and code signing / notarization are still outstanding.
