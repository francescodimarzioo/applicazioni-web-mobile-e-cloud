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

#  Live Deployment

-   🔹 Backend (Render)\
    https://applicazioni-web-mobile-e-cloud.onrender.com

-   🔹 Frontend (Vercel)\
    https://TUO-FRONTEND.vercel.app

------------------------------------------------------------------------

#  Architettura

 mermaid
flowchart LR
    User --> Frontend[React + Vite (Vercel)]
    Frontend --> Backend[Node.js + Express (Render)]
    Backend --> MongoDB[(MongoDB Atlas)]


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
