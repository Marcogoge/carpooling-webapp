from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3, os, re

app = Flask(__name__)
CORS(app, origins=['http://localhost:4200'])
DB = os.path.join(os.path.dirname(__file__), 'carpooling.db')

def get_db():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.executescript('''
        CREATE TABLE IF NOT EXISTS autista (
            id_autista INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL, cognome TEXT NOT NULL,
            num_patente TEXT NOT NULL UNIQUE,
            scadenza_patente TEXT NOT NULL,
            telefono TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE, foto TEXT
        );
        CREATE TABLE IF NOT EXISTS passeggero (
            id_passeggero INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL, cognome TEXT NOT NULL,
            documento_identita TEXT NOT NULL UNIQUE,
            telefono TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE
        );
        CREATE TABLE IF NOT EXISTS viaggio (
            id_viaggio INTEGER PRIMARY KEY AUTOINCREMENT,
            citta_partenza TEXT NOT NULL, citta_arrivo TEXT NOT NULL,
            data_ora_partenza TEXT NOT NULL,
            tempo_stimato INTEGER NOT NULL,
            contributo REAL NOT NULL, soste TEXT,
            bagaglio INTEGER DEFAULT 1, animali INTEGER DEFAULT 0,
            posti_max INTEGER NOT NULL,
            marca_auto TEXT NOT NULL, modello_auto TEXT NOT NULL,
            targa_auto TEXT NOT NULL,
            id_autista INTEGER NOT NULL,
            FOREIGN KEY (id_autista) REFERENCES autista(id_autista)
        );
        CREATE TABLE IF NOT EXISTS prenotazione (
            id_prenotazione INTEGER PRIMARY KEY AUTOINCREMENT,
            data_prenotazione TEXT DEFAULT (datetime('now')),
            stato TEXT NOT NULL DEFAULT 'attesa',
            id_viaggio INTEGER NOT NULL,
            id_passeggero INTEGER NOT NULL,
            FOREIGN KEY (id_viaggio) REFERENCES viaggio(id_viaggio),
            FOREIGN KEY (id_passeggero) REFERENCES passeggero(id_passeggero)
        );
        CREATE TABLE IF NOT EXISTS feedback (
            id_feedback INTEGER PRIMARY KEY AUTOINCREMENT,
            voto INTEGER NOT NULL CHECK(voto BETWEEN 1 AND 5),
            giudizio TEXT,
            id_viaggio INTEGER NOT NULL,
            id_autore_passeggero INTEGER,
            id_destinatario_autista INTEGER,
            id_destinatario_passeggero INTEGER,
            tipo_feedback TEXT NOT NULL,
            FOREIGN KEY (id_viaggio) REFERENCES viaggio(id_viaggio)
        );
        INSERT OR IGNORE INTO autista VALUES
            (1,'Marco','Rossi','PAT12345A','2028-05-12','3331111111','marco.rossi@email.it','marco.jpg'),
            (2,'Luca','Bianchi','PAT67890B','2027-11-20','3332222222','luca.bianchi@email.it','luca.jpg');
        INSERT OR IGNORE INTO passeggero VALUES
            (1,'Alessandro','Conti','DOC001','3401111111','alessandro@email.it'),
            (2,'Francesca','Romano','DOC002','3402222222','francesca@email.it');
        INSERT OR IGNORE INTO viaggio VALUES
            (1,'Milano','Roma','2026-06-10 08:00:00',180,35.00,'Bologna',1,0,4,'Fiat','Tipo','AB123CD',1),
            (2,'Torino','Genova','2026-06-12 14:30:00',120,20.00,NULL,1,1,3,'Volkswagen','Golf','EF456GH',2);
        INSERT OR IGNORE INTO prenotazione VALUES
            (1,datetime('now'),'accettata',1,1),
            (2,datetime('now'),'attesa',1,2);
        INSERT OR IGNORE INTO feedback VALUES
            (1,5,'Viaggio perfetto!',1,1,1,NULL,'per_autista');
    ''')
    conn.commit(); conn.close()

# ── LOGIN ────────────────────────────────────────────────────────
@app.route('/login', methods=['POST','OPTIONS'])
def login():
    if request.method == 'OPTIONS': return jsonify({}), 200
    b = request.json
    tipo  = b.get('tipo','')
    email = b.get('email','').strip().lower()
    id    = b.get('id')                              # <-- era: nome = b.get('nome','').strip()

    if not email or not id or tipo not in ['autista','passeggero']:
        return jsonify({'errore':'Dati mancanti'}), 400

    conn = get_db()
    if tipo == 'autista':
        row = conn.execute(
            'SELECT id_autista AS id, nome, cognome, email FROM autista WHERE LOWER(email)=? AND id_autista=?',
            (email, int(id))).fetchone()             # <-- era: AND LOWER(nome)=?
    else:
        row = conn.execute(
            'SELECT id_passeggero AS id, nome, cognome, email FROM passeggero WHERE LOWER(email)=? AND id_passeggero=?',
            (email, int(id))).fetchone()             # <-- era: AND LOWER(nome)=?
    conn.close()

    if not row:
        return jsonify({'errore':'Credenziali non valide. Controlla email e ID.'}), 401
    return jsonify({'successo':True,'utente':dict(row),'tipo':tipo})

# ── AUTISTI ──────────────────────────────────────────────────────
@app.route('/autisti/index.php', methods=['GET','POST','OPTIONS'])
def autisti():
    if request.method == 'OPTIONS': return jsonify({}), 200
    conn = get_db()
    if request.method == 'GET':
        id_a = request.args.get('id')
        if id_a:
            row = conn.execute('''
                SELECT a.*, ROUND(AVG(f.voto),1) as voto_medio
                FROM autista a
                LEFT JOIN feedback f ON f.id_destinatario_autista=a.id_autista
                WHERE a.id_autista=? GROUP BY a.id_autista''', (id_a,)).fetchone()
            if not row: return jsonify({'errore':'Non trovato'}), 404
            return jsonify({'successo':True,'dati':dict(row)})
        rows = conn.execute('''
            SELECT a.*, ROUND(AVG(f.voto),1) as voto_medio
            FROM autista a
            LEFT JOIN feedback f ON f.id_destinatario_autista=a.id_autista
            GROUP BY a.id_autista''').fetchall()
        return jsonify({'successo':True,'dati':[dict(r) for r in rows]})
    b = request.json
    campi = ['nome','cognome','num_patente','scadenza_patente','telefono','email']
    for f in campi:
        if not b.get(f): return jsonify({'errore':f'Campo mancante: {f}'}), 400
    try:
        conn.execute(
            'INSERT INTO autista (nome,cognome,num_patente,scadenza_patente,telefono,email,foto)VALUES (?,?,?,?,?,?,?)',
            (b['nome'],b['cognome'],b['num_patente'],b['scadenza_patente'],
            b['telefono'],b['email'].lower(),b.get('foto')))
        conn.commit()
        new_id = conn.execute('SELECT last_insert_rowid()').fetchone()[0]
        return jsonify({'successo':True,'id':new_id}), 201
    except Exception as e:
        return jsonify({'errore':'Email o patente gia registrati'}), 409

# ── PASSEGGERI ───────────────────────────────────────────────────
@app.route('/passeggeri/index.php', methods=['GET','POST','OPTIONS'])
def passeggeri():
    if request.method == 'OPTIONS': return jsonify({}), 200
    conn = get_db()
    if request.method == 'GET':
        id_p = request.args.get('id')
        if not id_p: return jsonify({'errore':'ID mancante'}), 400
        row = conn.execute('''
            SELECT p.*, ROUND(AVG(f.voto),1) as voto_medio
            FROM passeggero p
            LEFT JOIN feedback f ON f.id_destinatario_passeggero=p.id_passeggero
            WHERE p.id_passeggero=? GROUP BY p.id_passeggero''', (id_p,)).fetchone()
        if not row: return jsonify({'errore':'Non trovato'}), 404
        return jsonify({'successo':True,'dati':dict(row)})
    b = request.json
    for f in ['nome','cognome','documento_identita','telefono','email']:
        if not b.get(f): return jsonify({'errore':f'Campo mancante: {f}'}), 400
    try:
        conn.execute(
            'INSERT INTO passeggero (nome,cognome,documento_identita,telefono,email)  VALUES (?,?,?,?,?)',
            (b['nome'],b['cognome'],b['documento_identita'],b['telefono'],b['email'].lower()))
        conn.commit()
        new_id = conn.execute('SELECT last_insert_rowid()').fetchone()[0]
        return jsonify({'successo':True,'id':new_id}), 201
    except Exception as e:
        return jsonify({'errore':'Email o documento gia registrati'}), 409

# ── VIAGGI ───────────────────────────────────────────────────────
@app.route('/viaggi/index.php', methods=['GET','POST','DELETE','OPTIONS'])
def viaggi():
    if request.method == 'OPTIONS': return jsonify({}), 200
    conn = get_db()
    if request.method == 'GET':
        id_v = request.args.get('id')
        if id_v:
            row = conn.execute('''
                SELECT v.*, a.nome, a.cognome, a.telefono, a.email, a.foto,
                        ROUND(AVG(f.voto),1) as voto_medio_autista,
                        (v.posti_max-(SELECT COUNT(*) FROM prenotazione
                        WHERE id_viaggio=v.id_viaggio AND stato='accettata')) as posti_disponibili
                FROM viaggio v JOIN autista a ON v.id_autista=a.id_autista
                LEFT JOIN feedback f ON f.id_destinatario_autista=a.id_autista
                WHERE v.id_viaggio=? GROUP BY v.id_viaggio''', (id_v,)).fetchone()
            if not row: return jsonify({'errore':'Non trovato'}), 404
            return jsonify({'successo':True,'dati':dict(row)})
      # ■■ GET lista viaggi con filtri ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
        partenza = request.args.get('partenza', '')
        arrivo = request.args.get('arrivo', '')
        data = request.args.get('data', '')
        bagaglio = request.args.get('bagaglio', '') # '1' o '0'
        animali = request.args.get('animali', '') # '1' o '0'
        prezzo_max = request.args.get('prezzo_max','') # numero
        posti_min = request.args.get('posti_min','1') # default 1
        sql = '''
        SELECT v.*, a.nome, a.cognome, a.foto,
        ROUND(AVG(f.voto),1) as voto_medio_autista,
        (v.posti_max-(SELECT COUNT(*) FROM prenotazione p2
        WHERE p2.id_viaggio=v.id_viaggio AND p2.stato='accettata'))
        as posti_disponibili,
        (SELECT COUNT(*) FROM prenotazione p3
        WHERE p3.id_viaggio=v.id_viaggio AND p3.stato='attesa')
        as prenotazioni_in_attesa
        FROM viaggio v
        JOIN autista a ON v.id_autista=a.id_autista
        LEFT JOIN feedback f ON f.id_destinatario_autista=a.id_autista
        WHERE 1=1
        '''
        params = []
        if partenza: sql += ' AND LOWER(v.citta_partenza) LIKE ?'; params.append(f'%{partenza.
        lower()}%')
        if arrivo: sql += ' AND LOWER(v.citta_arrivo) LIKE ?'; params.append(f'%{arrivo.lower()}%')
        if data: sql += ' AND date(v.data_ora_partenza)=?'; params.append(data)
        if bagaglio: sql += ' AND v.bagaglio=?'; params.append(int(bagaglio))
        if animali: sql += ' AND v.animali=?'; params.append(int(animali))
        if prezzo_max: sql += ' AND v.contributo<=?'; params.append(float(prezzo_max))
        sql += ' GROUP BY v.id_viaggio HAVING posti_disponibili>=?'
        params.append(int(posti_min) if posti_min else 1)
        sql += ' ORDER BY v.data_ora_partenza'
        rows = conn.execute(sql, params).fetchall()
        return jsonify({'successo':True,'dati':[dict(r) for r in rows]})
    if request.method == 'POST':
        b = request.json
        obbligatori=['citta_partenza','citta_arrivo','data_ora_partenza',
                    'tempo_stimato','contributo','posti_max',
                    'marca_auto','modello_auto','targa_auto','id_autista']
        for f in obbligatori:
            if not b.get(f) and b.get(f)!=0:
                return jsonify({'errore':f'Campo mancante: {f}'}), 400
        conn.execute('''
            INSERT INTO viaggio (citta_partenza,citta_arrivo,data_ora_partenza,
            tempo_stimato,contributo,soste,bagaglio,animali,posti_max,
            marca_auto,modello_auto,targa_auto,id_autista)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)''',
            (b['citta_partenza'],b['citta_arrivo'],b['data_ora_partenza'],
            b['tempo_stimato'],b['contributo'],b.get('soste'),
            b.get('bagaglio',1),b.get('animali',0),b['posti_max'],
            b['marca_auto'],b['modello_auto'],b['targa_auto'],b['id_autista']))
        conn.commit()
        new_id = conn.execute('SELECT last_insert_rowid()').fetchone()[0]
        return jsonify({'successo':True,'id_viaggio':new_id}), 201
    if request.method == 'DELETE':
        id_v = request.args.get('id')
        conn.execute('DELETE FROM viaggio WHERE id_viaggio=?',(id_v,))
        conn.commit()
        return jsonify({'successo':True})

# ── PRENOTAZIONI ─────────────────────────────────────────────────
@app.route('/prenotazioni/index.php', methods=['GET','POST','PUT','OPTIONS'])
def prenotazioni():
    if request.method == 'OPTIONS': return jsonify({}), 200
    conn = get_db()
    if request.method == 'GET':
        id_pr = request.args.get('id')
        id_v  = request.args.get('id_viaggio')
        id_p  = request.args.get('id_passeggero')
        vm    = request.args.get('voto_min')
        if id_pr:
            row = conn.execute('''
                SELECT pr.*, pa.nome as nome_pass, pa.cognome as cog_pass,
                        pa.email as email_pass,
                        v.citta_partenza, v.citta_arrivo, v.data_ora_partenza,
                        v.contributo, v.soste, v.id_autista,
                        a.nome as nome_autista, a.cognome as cog_autista,
                        a.telefono as tel_autista,
                        v.marca_auto, v.modello_auto, v.targa_auto
                FROM prenotazione pr
                JOIN passeggero pa ON pr.id_passeggero=pa.id_passeggero
                JOIN viaggio v ON pr.id_viaggio=v.id_viaggio
                JOIN autista a ON v.id_autista=a.id_autista
                WHERE pr.id_prenotazione=? AND pr.stato='accettata' ''', (id_pr,)).fetchone()
            if not row: return jsonify({'errore':'Non trovata'}), 404
            return jsonify({'successo':True,'dati':dict(row)})
        if id_v:
            sql='''
                SELECT pa.id_passeggero, pa.nome, pa.cognome, pa.email,
                        pr.id_prenotazione, pr.stato,
                        ROUND(AVG(f.voto),1) as voto_medio
                FROM prenotazione pr
                JOIN passeggero pa ON pr.id_passeggero=pa.id_passeggero
                LEFT JOIN feedback f ON f.id_destinatario_passeggero=pa.id_passeggero
                WHERE pr.id_viaggio=?
                GROUP BY pa.id_passeggero, pr.id_prenotazione, pr.stato
            '''
            params=[id_v]
            if vm: sql+=' HAVING voto_medio>=? OR voto_medio IS NULL'; params.append(vm)
            rows=conn.execute(sql,params).fetchall()
            return jsonify({'successo':True,'dati':[dict(r) for r in rows]})
        if id_p:
            rows=conn.execute('''
                SELECT pr.*, v.citta_partenza, v.citta_arrivo,
                        v.data_ora_partenza, v.contributo, v.id_autista,
                        a.nome as nome_autista, a.cognome as cog_autista
                FROM prenotazione pr
                JOIN viaggio v ON pr.id_viaggio=v.id_viaggio
                JOIN autista a ON v.id_autista=a.id_autista
                WHERE pr.id_passeggero=?
                ORDER BY pr.data_prenotazione DESC''', (id_p,)).fetchall()
            return jsonify({'successo':True,'dati':[dict(r) for r in rows]})
        return jsonify({'errore':'Parametro mancante'}), 400
    if request.method == 'POST':
        b = request.json
        chk=conn.execute('''
            SELECT posti_max,
                    (SELECT COUNT(*) FROM prenotazione WHERE id_viaggio=? AND stato='accettata') as occ
            FROM viaggio WHERE id_viaggio=?''',(b['id_viaggio'],b['id_viaggio'])).fetchone()
        if not chk or (chk['posti_max']-chk['occ'])<=0:
            return jsonify({'errore':'Nessun posto disponibile'}), 409
        conn.execute(
            "INSERT INTO prenotazione (id_viaggio,id_passeggero,stato) VALUES (?,?,'attesa')",
            (b['id_viaggio'],b['id_passeggero']))
        conn.commit()
        new_id=conn.execute('SELECT last_insert_rowid()').fetchone()[0]
        return jsonify({'successo':True,'id':new_id}), 201
    if request.method == 'PUT':
        id_pr=request.args.get('id')
        stato=request.json.get('stato')
        if stato not in ['accettata','rifiutata']:
            return jsonify({'errore':'Stato non valido'}), 400
        conn.execute('UPDATE prenotazione SET stato=? WHERE id_prenotazione=?',(stato,id_pr))
        conn.commit()
        return jsonify({'successo':True})

# ── FEEDBACK ─────────────────────────────────────────────────────
@app.route('/feedback/index.php', methods=['GET','POST','OPTIONS'])
def feedback():
    if request.method == 'OPTIONS': return jsonify({}), 200
    conn = get_db()
    if request.method == 'GET':
        id_a = request.args.get('id_autista')
        id_p = request.args.get('id_passeggero')
        if id_a:
            rows=conn.execute('''
                SELECT f.voto, f.giudizio,
                        COALESCE(p.nome, a2.nome) as autore_nome,
                        COALESCE(p.cognome, a2.cognome) as autore_cognome,
                        v.citta_partenza, v.citta_arrivo, v.data_ora_partenza
                FROM feedback f
                LEFT JOIN passeggero p ON f.id_autore_passeggero=p.id_passeggero
                LEFT JOIN autista a2 ON f.id_autore_autista=a2.id_autista
                JOIN viaggio v ON f.id_viaggio=v.id_viaggio
                WHERE f.id_destinatario_autista=? AND f.tipo_feedback='per_autista'
                ORDER BY v.data_ora_partenza DESC''', (id_a,)).fetchall()
            return jsonify({'successo':True,'dati':[dict(r) for r in rows]})
        if id_p:
            rows=conn.execute('''
                SELECT f.voto, f.giudizio,
                        COALESCE(a2.nome, p2.nome) as autore_nome,
                        COALESCE(a2.cognome, p2.cognome) as autore_cognome,
                        v.citta_partenza, v.citta_arrivo, v.data_ora_partenza
                FROM feedback f
                LEFT JOIN autista a2 ON f.id_autore_autista=a2.id_autista
                LEFT JOIN passeggero p2 ON f.id_autore_passeggero=p2.id_passeggero
                JOIN viaggio v ON f.id_viaggio=v.id_viaggio
                WHERE f.id_destinatario_passeggero=? AND f.tipo_feedback='per_passeggero'
                ORDER BY v.data_ora_partenza DESC''', (id_p,)).fetchall()
            return jsonify({'successo':True,'dati':[dict(r) for r in rows]})
        return jsonify({'errore':'Parametro mancante'}), 400
    if request.method == 'POST':
        b = request.json
        if not 1 <= int(b.get('voto',0)) <= 5:
            return jsonify({'errore':'Voto deve essere 1-5'}), 400
        # Supporta sia autore autista che autore passeggero
        conn.execute('''
            INSERT INTO feedback
                (voto,giudizio,id_viaggio,
                id_autore_autista,id_autore_passeggero,
                id_destinatario_autista,id_destinatario_passeggero,tipo_feedback)
            VALUES (?,?,?,?,?,?,?,?)''',
            (b['voto'], b.get('giudizio'),b['id_viaggio'],
            b.get('id_autore_autista'), b.get('id_autore_passeggero'),
            b.get('id_destinatario_autista'), b.get('id_destinatario_passeggero'),
            b['tipo_feedback']))
        conn.commit()
        new_id=conn.execute('SELECT last_insert_rowid()').fetchone()[0]
        return jsonify({'successo':True,'id':new_id}), 201

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)