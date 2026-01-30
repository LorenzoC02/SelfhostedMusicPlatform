# 🎵 Self-Hosted Music Platform (MVP)

Architettura a microservizi per streaming audio personale. Orchestra servizi specializzati tramite API Gateway e Docker Compose.

---

## 🎯 Obiettivo

Sistema minimale per:

- Registrazione e Login (JWT)
- Upload brani (MP3/FLAC)
- Creazione Playlist
- Streaming audio via browser

---

## 🏗️ Architettura

| Servizio              | Stack           | DB / Storage                    | Funzione                  |
| --------------------- | --------------- | ------------------------------- | ------------------------- |
| **Frontend**          | HTML/JS Vanilla | -                               | Interfaccia web SPA       |
| **API Gateway**       | Kong            | -                               | Routing e reverse proxy   |
| **Auth Service**      | Spring Boot     | Postgres (Users)                | Gestione identità e token |
| **Content Service**   | Node/Express    | Postgres (Tracks), Mongo (Meta) | Gestione file e metadati  |
| **Playlist Service**  | Node/Express    | Postgres (Playlists)            | Gestione raccolte         |
| **Streaming Service** | Go              | Filesystem                      | Erogazione flusso audio   |

---

## �️ Tecnologie Utilizzate

- **Docker Compose**: Orchestrazione containers.
- **Java 21 / Spring**: Logica di autenticazione robusta.
- **Node.js**: Microservizi I/O bound leggeri.
- **Golang**: Streaming ad alte prestazioni.
- **PostgreSQL**: Dati relazionali.
- **MongoDB**: Metadati non strutturati.
- **Redis**: Cache temporanea.

---

## ⚡ Avvio Rapido

1.  **Start Containers**:

    ```bash
    docker compose -p test-self-host up -d --build
    ```

2.  **Accesso**:
    Aprire [http://localhost:8087](http://localhost:8087)

3.  **Credenziali**:
    Registrare un nuovo utente all'avvio.

---

## � Note

- Porte esposte: `8087` (Web), `8000` (Gateway).
