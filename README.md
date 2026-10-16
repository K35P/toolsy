# Toolsy

Toolsy è un'app desktop per conversioni locali di immagini, basata su Tauri 2, Rust e React. Durante la migrazione Electron resta disponibile come fallback fino al completamento della QA nativa macOS, Windows e Linux.

## Sviluppo Tauri

Prerequisiti: Node.js 20.19 o superiore, pnpm 11.25.0, Rust stable (almeno 1.90 per i plugin desktop correnti), toolchain nativa del sistema operativo e WebView2 su Windows. Su Linux servono le librerie WebKitGTK richieste da Tauri.

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

Il runtime desktop usa Tauri 2 con comandi Rust per conversioni, file e impostazioni, dialoghi nativi e adapter frontend. JPG, WebP, AVIF e TIFF supportano la qualità; PNG usa compressione senza perdita. L'input SVG viene rasterizzato localmente e per sicurezza gli SVG sopra 100 megapixel sono rifiutati. Il TIFF usa compressione JPEG per mantenere la qualità configurabile. L'aggiornamento automatico era codice non attivo nell'app originale: il componente non era montato e il feed era un URL dimostrativo. La build nativa macOS ARM e il round-trip dei formati sono verificati in locale; una GitHub Actions esegue test e packaging per macOS, Windows e Ubuntu. Gli smoke test interattivi Windows/Linux e macOS Intel restano da eseguire sui rispettivi sistemi.
