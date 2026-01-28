1️⃣ Node.js – basi indispensabili (30–40 min)

📘 Node.js Docs
Guarda solo queste parti:

Introduction to Node.js

cos’è Node

event loop (solo concetto)

Modules (CommonJS)

require

module.exports

Working with the File System

fs

fs/promises

Process & Environment

process.env

variabili d’ambiente

👉 Subito dopo implementi

progetto Node (npm init)

script start

lettura di un file dal filesystem

2️⃣ Express.js – API REST minima (30 min)

📘 Express – Getting Started

Guarda solo:

Hello world

Routing

app.get

app.post

Request / Response

req.body

req.params

req.query

Middleware

cosa sono

app.use

👉 Subito dopo implementi

server Express

endpoint:

POST /upload

GET /content/:id

3️⃣ Multer – upload file audio (30 min)

📘 Multer README (GitHub)

Guarda in ordine:

Basic usage

Single file upload

upload.single('file')

DiskStorage

destination

filename

File filter

accettare solo mp3 / flac

👉 Subito dopo implementi

upload di un file audio

salvataggio su disco (/uploads)

ritorno del path del file

4️⃣ music-metadata – estrazione metadati (20 min)

📘 music-metadata (npm / GitHub)

Guarda solo:

parseFile

Metadata structure

common

format

Pictures / Cover art

👉 Subito dopo implementi

estrazione:

titolo

artista

album

durata

cover

stampa dei metadati in console

5️⃣ FFmpeg / ffprobe – info tecniche (opzionale ma utile)

📘 FFmpeg Docs

Guarda:

ffprobe

durata

bitrate

codec

Installazione

solo installare e testare

👉 Subito dopo implementi

comando ffprobe da terminale

(opzionale) uso via Node con fluent-ffmpeg

⚠️ Se hai poco tempo: puoi saltarlo all’inizio

6️⃣ PostgreSQL – dati principali (45 min)

📘 node-postgres (pg) Docs

Guarda:

Connecting to a database

Running queries

Parameterized queries

Transactions (solo concetto)

👉 Subito dopo implementi

tabella tracks

id

title

artist

duration

file_path

insert dopo upload

select per GET /content/:id

7️⃣ MongoDB + Mongoose – metadati estesi (30 min)

📘 Mongoose Getting Started

Guarda:

Connecting

Schemas

Models

Save & Find

👉 Subito dopo implementi

collection track_metadata

salvataggio:

tags completi

cover art

dati extra

8️⃣ Architettura del microservizio (15 min)

📘 (concetto, non codice)

Guarda/decidi:

Separazione responsabilità

controller

service

repository

Flusso

upload → estrazione → salvataggio → response


Error handling

file non valido

metadata mancanti

👉 Subito dopo implementi

struttura cartelle:

src/
  routes/
  controllers/
  services/
  db/