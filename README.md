# Content Service

Microservizio per l'ingestione e la gestione di contenuti audio (MP3, FLAC).

## Requisiti
- Node.js
- Docker (per database)

## Avvio Rapido

1.  **Avvia i Database (PostgreSQL & MongoDB)**
    ```bash
    docker-compose up -d
    ```

2.  **Avvia il Server**
    ```bash
    npm run dev
    ```
    Il server partirà sulla porta `3000`.

## API Reference

### 1. Carica un file audio
**POST** `/upload`
- **Body**: `multipart/form-data`
    - `file`: Il file audio da caricare (.mp3 o .flac)

**Esempio cURL:**
```bash
curl -X POST -F "file=@/percorso/del/tuo/brano.mp3" http://localhost:3000/upload
```
*Risposta attesa:*
```json
{
  "message": "File uploaded and processed successfully",
  "track": {
    "id": 1,
    "title": "Song Title",
    "artist": "Artist Name",
    "duration": 215.5,
    "file_path": "..."
  }
}
```

### 2. Lista tutti i brani
**GET** `/content`
Recupera l'elenco di tutti i brani caricati (ordinati per data).

**Esempio cURL:**
```bash
curl http://localhost:3000/content
```

### 3. Dettagli Brano
**GET** `/content/:id`
Recupera dettagli completi (inclusi metadati estesi da MongoDB).

**Esempio cURL:**
```bash
curl http://localhost:3000/content/1
```
*(Sostituisci `1` con l'ID restituito dall'upload)*

---

## Test Manuale (Postman / Insomnia)
1. Imposta metodo `POST`.
2. URL: `http://localhost:3000/upload`.
3. Body -> Form Data -> Key: `file` (tipo File), Value: (Seleziona un mp3 dal tuo computer).
4. Invia.
