# CarPooling WebApp
Applicazione web per la condivisione di viaggi in auto.
Stack: Angular 17 (frontend) + Python Flask (backend) + SQLite (database)
## Prerequisiti
Assicurati di avere installato:
- Python 3.10 o superiore: https://www.python.org/downloads/
- Node.js 18 o superiore: https://nodejs.org/
- Git: https://git-scm.com/
## Avvio del Backend (Flask)
```bash
# 1. Vai nella cartella backend
cd backend
# 2. Installa le dipendenze Python
pip install flask flask-cors
# 3. Avvia il server
py app.py
```
Il server parte su http://localhost:5000
Il database carpooling.db viene creato automaticamente al primo avvio.
## Avvio del Frontend (Angular)
```bash
# Apri un SECONDO terminale (lascia Flask aperto nel primo)
# 1. Vai nella cartella frontend
cd frontend
# 2. Installa le dipendenze Node
npm install
# 3. Avvia il server Angular
npx ng serve
```
Apri il browser su http://localhost:4200
## Credenziali di test
| Tipo | Email | Nome |
|-----------|--------------------------|------------|
| Autista | marco.rossi@email.it | Marco |
| Passeggero| alessandro@email.it | Alessandro |
## Visualizzare il database
1. Scarica DB Browser for SQLite: https://sqlitebrowser.org/dl/
2. Apri il programma
3. Clicca 'Apri database'
4. Naviga fino a backend/carpooling.db
5. Vai su 'Sfoglia dati' per vedere le tabelle
Oppure testa le API direttamente nel browser:
- http://localhost:5000/viaggi/index.php
- http://localhost:5000/autisti/index.php
## Struttura del progetto
```
carpooling-webapp/
backend/
app.py <- tutto il backend Flask
carpooling.db <- database (creato automaticamente)
requirements.txt
frontend/
src/app/ <- componenti Angular
README.md
```
## Avvio rapido (entrambi insieme)
Terminale 1: cd backend && py app.py
Terminale 2: cd frontend && npx ng serve
Browser: http://localhost:4200
