# Toolsy

Toolsy è un'app desktop per conversioni locali di immagini. La migrazione da Electron a Tauri 2 è in corso: il frontend React è condiviso e Electron resta disponibile durante il passaggio.

## Sviluppo Tauri

Prerequisiti: Node.js/npm, Rust stable (almeno 1.90 per i plugin desktop correnti), toolchain nativa del sistema operativo e WebView2 su Windows. Su Linux servono le librerie WebKitGTK richieste da Tauri.

```sh
npm install
npm run tauri:dev
```

Build nativa per il sistema corrente:

```sh
npm run tauri:build
```

L'output di build è in `src-tauri/target/release/bundle`. Per la distribuzione servono ancora la configurazione delle chiavi e dell'endpoint updater; non distribuire build di migrazione prima della verifica manuale su ogni sistema supportato.

## Stato della migrazione

Il target usa Tauri 2, comandi Rust per conversioni, file e settings, dialoghi nativi e un adapter condiviso con Electron. La build e la parità funzionale vanno ancora verificate con Cargo installato. L'input SVG è temporaneamente escluso dal selettore Tauri; PNG e TIFF usano l'encoder standard senza parametro qualità. Vibrancy macOS e aggiornamento automatico richiedono ancora configurazione/verifica dedicate.
