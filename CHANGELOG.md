# Changelog

Le modifiche rilevanti di Toolsy sono raccolte qui.

## Unreleased — Migrazione Tauri

- Portato il runtime desktop a Tauri 2 e Rust, mantenendo temporaneamente Electron come fallback durante la QA multipiattaforma.
- Spostate in Rust le conversioni locali JPEG, PNG, WebP, AVIF e TIFF; aggiunta la rasterizzazione SVG con limite di sicurezza a 100 megapixel.
- Ripristinata la decodifica AVIF in ingresso con dav1d e la lettura dei TIFF JPEG generati dall'app.
- Aggiunti dialoghi nativi, gestione dei file convertiti, controlli finestra e persistenza delle impostazioni in Tauri.
- Al primo avvio Tauri viene tentata l'importazione delle impostazioni Electron; il file originale viene conservato.
- L'auto-updater resta escluso: nella versione precedente non era attivo e il feed era dimostrativo.
- La migrazione non è ancora pronta per il rilascio: la QA Windows/Linux, gli installer e la firma/notarizzazione sono ancora da completare.
