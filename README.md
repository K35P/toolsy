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

Al primo avvio Tauri, se non esiste ancora `settings.json` nella directory dati Tauri, Toolsy prova a importare le impostazioni Electron da `Toolsy/settings.json` nella directory di configurazione utente. Il file originale non viene cancellato.

## Stato della migrazione

Il target usa Tauri 2, comandi Rust per conversioni, file e settings, dialoghi nativi e un adapter condiviso con Electron. L'input SVG viene rasterizzato localmente; per sicurezza gli SVG più grandi di 100 megapixel vengono rifiutati. PNG e TIFF sono formati lossless e non espongono un cursore qualità. Build e parità funzionale devono ancora essere verificate su ogni sistema operativo. La vibrancy macOS e l'aggiornamento automatico non fanno parte del MVP: l'updater resta differito finché non saranno configurati endpoint e chiavi di firma.
