#  ExpenseSplitApp

## Progetto di Applicazioni Web, Mobile e Cloud

------------------------------------------------------------------------

##  Descrizione del Progetto

Questo progetto consiste nello sviluppo di un'applicazione
**full-stack** per la gestione delle spese personali.\
L'applicazione è realizzata secondo un'architettura moderna separando
chiaramente:

-   **Frontend (Single Page Application)**
-   **Backend (API REST)**
-   **Database (MongoDB)**

L'obiettivo è rispettare i requisiti del corso: - Applicazione web
fruibile anche da dispositivi mobile - Architettura SPA - Backend
separato - DBMS per la persistenza dei dati - Autenticazione sicura

------------------------------------------------------------------------

#  Architettura del Sistema

    applicazioni-web-mobile-e-cloud/
    │
    ├── frontend/   # React SPA (Vite)
    └── backend/    # Express API + MongoDB

L'applicazione adotta una chiara separazione delle responsabilità:

-   **Frontend** → Presentazione e interazione utente\
-   **Backend** → Logica di business e gestione API\
-   **Database** → Persistenza dati

------------------------------------------------------------------------

#  Frontend

##  Tecnologie Utilizzate

-   React 19
-   Vite 7
-   JavaScript
-   CSS
-   ESLint

##  Caratteristiche

-   Architettura Single Page Application
-   Componentizzazione tramite React
-   Comunicazione REST con backend
-   Gestione stato lato client
-   Layout responsive (compatibile mobile)

##  Avvio Frontend

``` bash
cd frontend
npm install
npm run dev
```

Disponibile su:

    http://localhost:5173

------------------------------------------------------------------------

# Backend

## Tecnologie Utilizzate

-   Node.js
-   Express 4
-   MongoDB
-   Mongoose 9
-   JWT (jsonwebtoken)
-   bcrypt
-   cors
-   dotenv
-   uuid

------------------------------------------------------------------------

## Struttura Backend

    backend/
    │
    ├── app.js
    ├── server.js
    │
    ├── controllers/
    │   ├── users.controller.js
    │   └── expenses.controller.js
    │
    ├── models/
    │   ├── User.js
    │   ├── UserModel.js
    │   ├── Expense.js
    │   └── ExpenseModel.js
    │
    ├── middleware/
    │   └── auth.js
    │
    ├── data/
    │   └── store.js

------------------------------------------------------------------------

##  Autenticazione

Il sistema utilizza autenticazione **stateless basata su JWT**:

-   Registrazione utente
-   Hashing password tramite bcrypt
-   Generazione token JWT
-   Middleware di verifica token
-   Protezione delle route sensibili

------------------------------------------------------------------------
##  Modello Dati

### User

-   Credenziali
-   Password hashata
-   Identificatore univoco

### Expense

-   Riferimento utente
-   Importo
-   Descrizione
-   Data

Persistenza gestita tramite MongoDB con Mongoose ODM.

------------------------------------------------------------------------

#  Avvio Backend

Creare un file `.env` nella cartella backend:

    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key

Avvio:

``` bash
cd backend
npm install
npm start
```

Backend disponibile su:

    http://localhost:5000

------------------------------------------------------------------------

# Comunicazione Frontend-Backend

Il frontend comunica con il backend tramite API REST.

Le route protette richiedono header:

    Authorization: Bearer <token>

------------------------------------------------------------------------

#  Requisiti di Sistema

-   Node.js \>= 18
-   npm
-   MongoDB

------------------------------------------------------------------------


**Progetto sviluppato per il corso di Applicazioni Web, Mobile e Cloud**
Francesco Di Marzio, Mariadele Di Biase, Fabiana Felicioni
