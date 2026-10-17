# Toolsy

Toolsy è un'app desktop per conversioni locali di immagini, basata su Tauri 2, Rust e React. Durante la migrazione Electron resta disponibile come fallback fino al completamento della QA nativa macOS, Windows e Linux.

## Sviluppo Tauri

Prerequisiti: Node.js 20.19 o superiore, pnpm 11.25.0, Rust stable (almeno 1.90 per i plugin desktop correnti), toolchain nativa del sistema operativo e WebView2 su Windows. Su Linux servono le librerie WebKitGTK richieste da Tauri. La decodifica AVIF usa dav1d: macOS/Linux richiedono `pkg-config`, Python, Meson e Ninja per compilare dav1d staticamente; NASM serve sulle build Linux x86_64 e macOS Intel. Windows richiede `pkg-config` e dav1d installato tramite vcpkg (`vcpkg install dav1d:x64-windows`).

```sh
pnpm install --frozen-lockfile
pnpm tauri:dev
```

Build nativa per il sistema corrente:

```sh
pnpm tauri:build
```

L'output di build è in `src-tauri/target/release/bundle`. Prima della distribuzione pubblica servono firma e notarizzazione per i sistemi scelti. L'auto-updater non viene incluso: nel progetto precedente non era attivo e il suo feed era dimostrativo. Non distribuire una build prima degli smoke test manuali su ogni sistema supportato.

Al primo avvio Tauri, se non esiste ancora `settings.json` nella directory dati Tauri, Toolsy prova a importare le impostazioni Electron da `Toolsy/settings.json` nella directory di configurazione utente. Il file originale non viene cancellato.

## Stato della migrazione

Il runtime desktop usa Tauri 2 con comandi Rust per conversioni, file e impostazioni, dialoghi nativi e adapter frontend. JPG, WebP, AVIF e TIFF supportano la qualità; PNG usa compressione senza perdita. L'input AVIF è decodificato con dav1d; l'input TIFF JPEG usa un decoder TIFF dedicato. L'input SVG viene rasterizzato localmente e per sicurezza gli SVG sopra 100 megapixel sono rifiutati. Il TIFF usa compressione JPEG per mantenere la qualità configurabile. L'aggiornamento automatico era codice non attivo nell'app originale: il componente non era montato e il feed era un URL dimostrativo. Il bundle macOS ARM è stato avviato e provato localmente; il bundle x86_64 è stato compilato e avviato via Rosetta, ma va ancora verificato su hardware Intel. Una GitHub Actions è configurata per test e packaging su macOS, Windows e Ubuntu. Gli smoke test Windows/Linux e la QA finale degli installer restano da eseguire sui rispettivi sistemi.
