# 💰 Expense Split -- Web Application

Applicazione web full-stack per la gestione e suddivisione delle spese
tra utenti.

Il progetto è stato sviluppato come esercitazione per il corso di
**Applicazioni Web, Mobile e Cloud** e include:

-   Backend REST API (Node.js + Express)
-   Frontend SPA (React + Vite)
-   Database MongoDB
-   Containerizzazione Docker
-   Test automatici
-   CI/CD con GitHub Actions
-   Deploy pubblico (Render + Vercel)

------------------------------------------------------------------------
## Funzionalità dell’app (cosa può fare l’utente)

ExpenseSplitApp è un’applicazione web che permette di gestire e dividere spese condivise in modo semplice.

###  Autenticazione
- **Registrazione utente**: creazione di un account con email e password.
- **Login**: accesso con credenziali e generazione di un **token JWT**.
- **Logout**: uscita dall’app e rimozione del token salvato nel browser.

### Gestione Spese (CRUD)
- **Aggiunta di una spesa** inserendo:
  - descrizione
  - importo totale
  - chi ha pagato (`paidBy`)
  - partecipanti (lista separata da virgola)
- **Visualizzazione lista spese** in tabella.
- **Eliminazione di una spesa**:
  - è possibile eliminare una spesa solo se si è autenticati
  - viene mostrata una finestra di conferma prima di cancellare

###  Calcolo automatico della quota per persona
- Per ogni spesa l’app calcola la quota:
  - **quota = importo / numero partecipanti**
- La quota per persona viene mostrata in tabella insieme alla spesa.

###  Ricerca e informazioni aggiuntive
- **Ricerca per descrizione**: filtro lato frontend che permette di trovare velocemente una spesa cercando nella descrizione.
- **Data di aggiunta**: nella tabella viene mostrata la data/ora in cui la spesa è stata inserita (campo `createdAt`).

###  Grafici (Data Visualization)
- Sezione dedicata ai grafici per una lettura immediata dei dati:
  - **andamento delle spese nel tempo**
  - **totale pagato per persona**
  - **partecipazione alle spese**
- I grafici usano i dati già scaricati dal backend (nessuna modifica alle API).

###  Sicurezza e autorizzazioni
- Password salvate in modo sicuro tramite **hashing (bcrypt)**.
- Rotte protette tramite **JWT**: senza token non è possibile gestire le spese.
- Controllo di autorizzazione: solo il proprietario (owner) può eliminare le proprie spese.

------------------------------------------------------------------------

#  Live Deployment

-   🔹 Backend (Render)\
    https://applicazioni-web-mobile-e-cloud.onrender.com

-   🔹 Frontend (Vercel)\
   https://applicazioni-web-mobile-e-cloud-hpnctl8yh.vercel.app

------------------------------------------------------------------------

#  Architettura


<img width="1130" height="636" alt="Diagramma Architettura" src="https://github.com/user-attachments/assets/fdf7e25b-392d-41c0-b8fd-a0c45c5e2e71" />


------------------------------------------------------------------------

#  Containerizzazione

L'applicazione è completamente containerizzata tramite Docker.

Componenti: - backend/Dockerfile - frontend/Dockerfile -
docker-compose.yml - Volume persistente per MongoDB

Avvio completo locale:

docker compose up --build

Servizi disponibili: - Frontend → http://localhost:5173 - Backend →
http://localhost:3001/health - MongoDB → mongodb://localhost:27017

------------------------------------------------------------------------

#  Setup Manuale (senza Docker)

## Backend

cd backend\
npm install\
npm start

Variabili d'ambiente richieste:

PORT=3001\
MONGO_URI=...\
JWT_SECRET=...\
JWT_EXPIRES_IN=7d

## Frontend

cd frontend\
npm install\
npm run dev

Variabile:

VITE_API_URL=http://localhost:3001

------------------------------------------------------------------------

#  Test Automatici

Il backend utilizza: - Jest - Supertest

Esecuzione:

cd backend\
npm test

Test implementato: - GET /health

------------------------------------------------------------------------

#  CI/CD -- GitHub Actions

File: .github/workflows/ci.yml

La pipeline esegue automaticamente:

Backend: - Avvio MongoDB come service - Installazione dipendenze -
Esecuzione test automatici

Frontend: - Installazione dipendenze - Build produzione

Ogni push o pull request attiva automaticamente la pipeline.

------------------------------------------------------------------------

#  Deployment Cloud

## Backend

Deploy su Render come Web Service.

Configurazione: - Root directory: backend - Build command: npm install -
Start command: npm start - Variabili ambiente: - MONGO_URI (MongoDB
Atlas) - JWT_SECRET - PORT

## Database

MongoDB Atlas (cluster gratuito)

## Frontend

Deploy su Vercel. - Root directory: frontend - Framework: Vite -
Environment variable:
VITE_API_URL=https://applicazioni-web-mobile-e-cloud.onrender.com

------------------------------------------------------------------------

#  Struttura Progetto

backend/\
controllers/\
routes/\
models/\
app.js\
server.js

frontend/\
src/\
public/

docs/\
architecture.md\
deployment.md

------------------------------------------------------------------------

#  Tecnologie Utilizzate

Backend: - Node.js - Express - MongoDB - Mongoose - JWT - Jest -
Supertest

Frontend: - React - Vite - Axios

DevOps: - Docker - Docker Compose - GitHub Actions - Render - Vercel


#  Autori

Francesco Di Marzio, Mariadele Di Biase, Fabiana Felicioni
Corso di Applicazioni Web, Mobile e Cloud\
Anno Accademico 2024/2025
