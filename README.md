## 🚀 Obiettivo dell'MVP

Permettere a un singolo utente di:
- Registrarsi e autenticarsi localmente  
- Caricare brani audio (mp3/flac)  
- Creare e gestire playlist private  
- Riprodurre musica in streaming on-demand  

Funzionalità avanzate come analytics, report LLM e ricerca full-text saranno sviluppate in fasi successive.

---

## 🏗️ Servizi MVP

| Servizio        | Linguaggio / Framework     | DB / Storage         | Ruolo principale |
|-----------------|---------------------------|-------------------|----------------|
| **auth-svc**    | Java / Spring Boot        | PostgreSQL, Redis | Registrazione e login con JWT, gestione sessioni |
| **content-svc** | Node.js / Express.js      | PostgreSQL, MongoDB | Upload e gestione brani, estrazione metadati |
| **playlist-svc**| Node.js / Express.js      | PostgreSQL         | Creazione/modifica playlist, aggiunta brani |
| **streaming-svc**| Go                       | File system, Redis | Streaming on-demand, Range requests, caching breve |
| **api-gateway** | Kong / NGINX             | -                 | Routing unico, autenticazione JWT, TLS/HTTPS |

---

## 🧰 Tecnologie e Framework

### **Auth Service**
- **Spring Security**: gestione autenticazione e autorizzazione RBAC  
- **JWT**: token di sessione valido 24h  
- **Redis**: gestione blacklist token e sessioni attive  

### **Content Service**
- **Multer**: gestione upload multipart  
- **FFmpeg / music-metadata**: estrazione metadati audio  
- **PostgreSQL / MongoDB**: metadati principali e dettagli aggiuntivi  

### **Playlist Service**
- **Sequelize / TypeORM**: ORM per PostgreSQL  
- **EventEmitter / Kafka producer**: notifica eventi "playlist_changed"  

### **Streaming Service**
- **net/http (Go)**: gestione HTTP 206 Partial Content  
- **Redis**: caching chunk audio  
- **Kafka producer**: pubblicazione evento di ascolto  

### **API Gateway**
- **Kong / NGINX**: routing API, autenticazione JWT, TLS autofirmato  

---

## 📦 Stack database e storage

| Componente      | Scopo |
|-----------------|-------|
| PostgreSQL      | utenti, playlist, brani principali |
| MongoDB         | metadati dettagli brani (lyrics, bitrate, tags) |
| Redis           | sessioni utente e cache streaming |
| Kafka           | eventi di ascolto e aggiornamenti playlist |
| File System     | storage dei file audio `/media` |

---

## 🐳 Containerizzazione

- **Docker**: containerizzazione di tutti i servizi  
- **docker-compose**: orchestrazione single-node  
- **k3s / minikube**: cluster Kubernetes per future espansioni  

---

## ⚡ MVP Flow

1. Utente si registra tramite **auth-svc**  
2. Effettua login e ottiene JWT valido  
3. Carica brani tramite **content-svc** → salvataggio su disco + PostgreSQL / MongoDB  
4. Crea playlist tramite **playlist-svc**  
5. Riproduce musica tramite **streaming-svc** → eventi ascolto pubblicati su Kafka  
6. **API Gateway** instrada tutte le richieste, valida JWT e applica TLS  

---

## 📌 Note

- Questo MVP è pensato per un singolo utente "owner".  
- Funzionalità avanzate (analytics, LLM report, ricerca full-text) saranno integrate successivamente.  
- Sicurezza self-hosted con certificati TLS autofirmati generati al primo avvio.  
- Backup giornaliero opzionale: dump SQL + archivio `/media`.  

---